
SMART: Scalable Multi-Agent Realistic Testbed
==============================================

.. raw:: html

   <main class="project-page">
     <header class="paper-hero">
       <video class="paper-hero__video" autoplay muted loop playsinline preload="auto" aria-hidden="true">
         <source src="_static/media/smart-background.mp4" type="video/mp4">
       </video>
       <h1>Advancing MAPF Toward the Real World: A Scalable Multi-Agent Realistic Testbed<br><span>(SMART)</span></h1>
       <p class="paper-authors">
         Jingtian Yan<sup>1</sup>, Zhifei Li<sup>1</sup>, William Kang<sup>1</sup>, Kevin Zheng<sup>1</sup>, Yulun Zhang<sup>1</sup>,<br>
         Zhe Chen<sup>1</sup>, Yue Zhang<sup>1</sup>, Daniel Harabor<sup>2</sup>, Stephen F. Smith<sup>1</sup>, Jiaoyang Li<sup>1</sup>
       </p>
       <p class="paper-affiliations"><sup>1</sup>Carnegie Mellon University &nbsp;&nbsp; <sup>2</sup>Monash University</p>
       <p class="publication-title">IEEE Robotics and Automation Letters, vol. 11, no. 6, pp. 7428-7435, 2026</p>
       <div class="paper-links">
         <a href="https://doi.org/10.1109/LRA.2026.3688062"><b>▤</b><span>Paper<small>IEEE Xplore</small></span></a>
         <a href="https://arxiv.org/abs/2503.04798"><b>⌁</b><span>Preprint<small>arXiv</small></span></a>
         <a href="https://github.com/JingtianYan/SMART"><b>⌘</b><span>Code<small>GitHub</small></span></a>
         <a href="https://smart-mapf.github.io/demo/"><b>▶</b><span>Live Demo<small>Try SMART</small></span></a>
       </div>
       <div class="award-callout"><span>★</span><div><strong>ICAPS 2025 Best Demo Award</strong><small>Presented at the International Conference on Automated Planning and Scheduling</small></div></div>
     </header>

     <section class="page-section interface-section">
       <div class="section-heading"><p>INTERACTIVE DEMO</p><h2>Use our online interface</h2><span>Run SMART directly in your browser—no installation required.</span></div>
       <div class="interface-card">
         <video class="interface-video" autoplay muted loop playsinline controls preload="metadata">
           <source src="_static/media/usage_web_interface.mp4" type="video/mp4">
           Your browser does not support embedded video.
         </video>
         <a class="interface-card__footer" href="https://smart-mapf.github.io/demo/"><span>smart-mapf.github.io/demo</span><b>Launch interface ↗</b></a>
       </div>
     </section>

     <section class="page-section">
       <div class="section-heading"><p>DEMO VIDEO</p><h2>SMART in action</h2></div>
       <div class="youtube-embed">
         <iframe src="https://www.youtube-nocookie.com/embed/irtFxMjyJXs" title="SMART: Scalable Multi-Agent Realistic Testbed demo video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
       </div>
     </section>

     <section class="page-section overview-section">
       <div class="section-heading section-heading--left"><p>OVERVIEW</p><h2>Closing the simulation-to-reality gap</h2></div>
       <div class="overview-copy">
         <p class="overview-lead">State-of-the-art MAPF algorithms plan paths for hundreds of robots in seconds, but their simplifying assumptions rarely survive real-world execution.</p>
         <p>They often use simplified robot models that ignore kinodynamic constraints and assume robots execute paths perfectly. SMART fills this gap with physics-based simulation, realistic robot behavior, and robust execution monitoring.</p>
         <ul>
           <li><b>Realistic environments</b><span>Physics engines model kinodynamics and execution uncertainty.</span></li>
           <li><b>Flexible execution</b><span>An Action Dependency Graph monitor supports different MAPF algorithms and robot models.</span></li>
           <li><b>Massive scalability</b><span>Efficient simulation enables experiments with thousands of robots.</span></li>
         </ul>
       </div>
     </section>

     <section class="page-section">
       <div class="section-heading"><p>KEY FEATURES</p><h2>Built for realistic MAPF evaluation</h2><span>A testbed designed to expose the challenges that matter in deployment.</span></div>
       <div class="feature-grid">
         <article><span>01</span><div class="feature-media feature-media--asset"><img src="_static/media/robust_execution.gif" alt="SMART robust multi-robot execution under delays and uncertainty"></div><h3>Robust execution</h3><p>Account for delays and uncertainty while preserving collision-free execution through ADG monitoring.</p></article>
         <article><span>02</span><div class="feature-media feature-media--asset"><img src="_static/media/scalable-smart.gif" alt="SMART simulation scaling to thousands of coordinated robots"></div><h3>Scalable experiments</h3><p>Move from small debugging scenarios to stress tests involving thousands of coordinated agents.</p></article>
       </div>
     </section>

     <section class="page-section gallery-section">
       <div class="section-heading"><p>RESULTS GALLERY</p><h2>Across simulators and robots</h2></div>
       <div class="results-grid">
         <figure><div class="result-media"><img src="_static/media/results-isaac.gif" alt="SMART robots executing paths in NVIDIA Isaac Sim"></div><figcaption><b>High-fidelity simulation</b><span>Kinodynamic execution in NVIDIA Isaac Sim.</span></figcaption></figure>
         <figure><div class="result-media"><img src="_static/media/results-robots.gif" alt="SMART paths executing on physical robots"></div><figcaption><b>Physical deployment</b><span>From planned paths to real multi-robot execution.</span></figcaption></figure>
       </div>
     </section>

     <section class="citation-section">
       <div><p class="section-kicker">CITE THIS WORK</p><h2>Publication</h2><p>Yan et al., “Advancing MAPF Toward the Real World: A Scalable Multi-Agent Realistic Testbed (SMART),” <i>IEEE Robotics and Automation Letters</i>, 2026.</p></div>
       <details open><summary>BibTeX</summary><pre>@article{yan2026smart,
     title={Advancing MAPF Toward the Real World: A Scalable Multi-Agent Realistic Testbed (SMART)},
     author={Yan, Jingtian and Li, Zhifei and Kang, William and Zheng, Kevin and Zhang, Yulun and Chen, Zhe and Zhang, Yue and Harabor, Daniel and Smith, Stephen F. and Li, Jiaoyang},
     journal={IEEE Robotics and Automation Letters},
     volume={11}, number={6}, pages={7428--7435},
     year={2026}, month={June}, doi={10.1109/LRA.2026.3688062}
   }</pre></details>
     </section>
   </main>
