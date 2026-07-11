from pathlib import Path

project = "SMART"
author = "SMART Team"
copyright = "2026, SMART Team"
version = release = "1.0"

extensions = []
templates_path = ["_templates"]
exclude_patterns = [
    "api.rst",
    "api_py.rst",
    "install.rst",
    "tutorials/**",
    "api_server/**",
    "api_client/**",
]

html_theme = "pydata_sphinx_theme"
html_title = "SMART: Scalable Multi-Agent Realistic Testbed"
html_static_path = ["_static"]
html_css_files = ["custom.css"]
html_sidebars = {"**": []}
html_theme_options = {
    "navbar_start": [],
    "navbar_center": ["navbar-nav"],
    "navbar_end": [],
    "external_links": [
        {"name": "Documentation", "url": "https://jingtianyan.github.io/smart-docs"},
        {"name": "Paper", "url": "https://ieeexplore.ieee.org/document/11495177"},
        {"name": "GitHub", "url": "https://github.com/JingtianYan/SMART"},
    ],
    "header_links_before_dropdown": 6,
    "footer_start": ["copyright"],
    "footer_end": ["sphinx-version"],
}
