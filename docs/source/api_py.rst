Quick Start with Python API
+++++++++++++++++++++++++++++++

We provide a Python API to easily run LSMART simulations with our provided planners, instance generators, invocation policies, and fail policies. You can customize the simulation parameters by changing the function arguments. In the repository, we have a python script ``run_lifelong.py`` that contains a function ``run_lifelong_argos`` to run LSMART simulations.

.. autofunction:: run_lifelong.run_lifelong_argos


Example Usage
+++++++++++++++++

To run in headless mode in the ``maps/kiva_large_w_mode.json`` map with 10 robots, ``RHCR`` planner (``PBS`` MAPF solver and ``SIPP`` single agent solver), ``PIBT`` fail policy, ``windowed`` problem instance generator, and ``periodic`` invocation policy, use the following command:

.. code-block:: console

    python run_lifelong.py maps/kiva_large_w_mode.json --headless True --screen 0 --num_agents 10 --save_stats True --rotation False --planner_invoke_policy default --sim_window_tick 10 --planner RHCR  --backup_solver PIBT --task_assigner_type windowed


To run the same simulation with visualization

.. code-block:: console

    python run_lifelong.py maps/kiva_large_w_mode.json --headless False --screen 0 --num_agents 10 --save_stats True --rotation False --planner_invoke_policy default --sim_window_tick 10 --planner RHCR  --backup_solver PIBT --task_assigner_type windowed

