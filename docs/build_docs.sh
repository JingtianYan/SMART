#!/usr/bin/env bash
set -euo pipefail

# ----------------------------
# Config
# ----------------------------
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DOCS_DIR="${ROOT_DIR}/docs"
SPHINX_SRC="${DOCS_DIR}/source"
SPHINX_OUT="${DOCS_DIR}/build/html"

# Controls:
#   DOCS_DEV=1  -> skip doxygen/exhale (fast)
#   CLEAN=1     -> clean build/html + doctrees
#   PORT=8000   -> autobuild port
#   HOST=127.0.0.1 -> autobuild host
DOCS_DEV="${DOCS_DEV:-0}"
CLEAN="${CLEAN:-1}"
PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"
CI="${CI:-0}"

# ----------------------------
# Projects (ADD NEW ONES HERE)
# ----------------------------
PROJECTS=(server client)

DOXYFILES=(
    "${DOCS_DIR}/Doxyfile.server"
    "${DOCS_DIR}/Doxyfile.client"
)

DOXY_OUT_DIRS=(
    "${DOCS_DIR}/doxygen/server"
    "${DOCS_DIR}/doxygen/client"
)

API_RST_DIRS=(
    "${SPHINX_SRC}/api_server"
    "${SPHINX_SRC}/api_client"
)

# ----------------------------
# Helpers
# ----------------------------
log() { echo -e "\033[1;34m[build]\033[0m $*"; }
die() { echo -e "\033[1;31m[error]\033[0m $*" >&2; exit 1; }

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "Missing command '$1' in PATH"
}

# Sanity check: arrays must align
if [[ ${#PROJECTS[@]} -ne ${#DOXYFILES[@]} ]] ||
[[ ${#PROJECTS[@]} -ne ${#DOXY_OUT_DIRS[@]} ]] ||
[[ ${#PROJECTS[@]} -ne ${#API_RST_DIRS[@]} ]]; then
    die "PROJECTS / DOXYFILES / DOXY_OUT_DIRS / API_RST_DIRS length mismatch"
fi

run_doxygen() {
    local doxyfile="$1"
    local outdir="$2"
    
    [[ -f "$doxyfile" ]] || die "Doxyfile not found: $doxyfile"
    
    # Remove previous output for determinism
    if [[ -d "$outdir" ]]; then
        log "Removing previous Doxygen output: $outdir"
        rm -rf "$outdir"
    fi
    
    # create the output directory
    mkdir -p "$outdir"
    
    log "Running doxygen: $doxyfile"
    (cd "$DOCS_DIR" && doxygen "$doxyfile")
    
    if [[ ! -d "${outdir}/xml" ]]; then
        die "Doxygen XML not found at ${outdir}/xml. Check GENERATE_XML=YES and XML_OUTPUT=xml in $doxyfile"
    fi
}

run_exhale_only() {
    # Triggers Exhale to generate api_<project> RST stubs into API_RST_DIRS[i].
    # Uses a temp output dir because we only care about generated RST.
    local project="$1"   # server | client | ...
    local api_dir="$2"   # docs/source/api_<project>
    
    log "Generating Exhale RST stubs for: $project -> $api_dir"
    rm -rf "$api_dir"
    
    local tmp_out
    tmp_out="$(mktemp -d)"
    
    EXHALE_PROJECT="$project" \
    python -m sphinx -b html "$SPHINX_SRC" "$tmp_out" -j auto -q
    
    rm -rf "$tmp_out"
}

# ----------------------------
# Preconditions
# ----------------------------
require_cmd python
require_cmd sphinx-autobuild

if [[ "$DOCS_DEV" != "1" ]]; then
    require_cmd doxygen
fi

# Optional clean of sphinx build artifacts
if [[ "$CLEAN" == "1" ]]; then
    log "Cleaning Sphinx build outputs"
    rm -rf "${DOCS_DIR}/build/html" "${DOCS_DIR}/build/doctrees"
fi

# ----------------------------
# 0) Fast dev mode (skip API generation)
# ----------------------------
if [[ "$DOCS_DEV" == "1" ]]; then
    log "DOCS_DEV=1 -> skipping doxygen + exhale"
    if [[ "$CI" == "1" ]]; then
        log "CI=1 -> building HTML without starting a local server"
        exec python -m sphinx -b html -E -a "$SPHINX_SRC" "$SPHINX_OUT" -j auto
    fi
    log "Starting sphinx-autobuild -> http://${HOST}:${PORT}"
    exec sphinx-autobuild "$SPHINX_SRC" "$SPHINX_OUT" \
    --host "$HOST" --port "$PORT" -j auto
fi

# ----------------------------
# 1) Doxygen: all projects
# ----------------------------
for i in "${!PROJECTS[@]}"; do
    run_doxygen "${DOXYFILES[i]}" "${DOXY_OUT_DIRS[i]}"
done

# ----------------------------
# 2) Exhale: generate API RST stubs
# ----------------------------
for i in "${!PROJECTS[@]}"; do
    run_exhale_only "${PROJECTS[i]}" "${API_RST_DIRS[i]}"
done


# ----------------------------
# 3) Final Sphinx build (site + both APIs)
# ----------------------------
log "Removing Sphinx doctrees cache"
rm -rf "${ROOT_DIR}/docs/build/doctrees"
log "Building final Sphinx HTML -> ${SPHINX_OUT}"
python -m sphinx -b html -E -a "$SPHINX_SRC" "$SPHINX_OUT" -j auto

# ----------------------------
# 4) Start dev server
# ----------------------------
if [[ "${CI}" == "1" ]]; then
    log "CI=1 -> skipping local http.server"
    exit 0
fi
log "Starting sphinx-autobuild -> http://${HOST}:${PORT}"
log "Tip (remote server): ssh -N -L ${PORT}:127.0.0.1:${PORT} <user>@<server>"
cd "$SPHINX_OUT"
python -m http.server "$PORT" --bind "$HOST"
