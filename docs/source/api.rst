.. only:: not devmode


Overview
+++++++++++++++++


.. figure:: readme_assets/l-smart-2.0.png
   :alt: LSMART Pipeline
   :align: left
   :width: 100%

   Detailed Architecture of LSMART. Red boxes are user customizable modules, gray boxes are non-customizable modules, and yellow boxes are data structures used for communicating between modules. Black arrows indicates required flow, red arrows indicate flow when the MAPF planner successfully finds collision-free paths, and yellow arrows indicate flow when the planner fails and the system need to recover from failure.


Lifelong Scalable Multi-Agent Realistic Testbed (LSMART) is an open-source simulator to evaluate any Multi-Agent Path Finding (MAPF) algorithm in a Fleet Management System (FMS) with Automated Guided Vehicles (AGVs) under lifelong MAPF (LMAPF) settings. MAPF aims to move a group of agents from their corresponding starting locations to their goals. Lifelong MAPF (LMAPF) is a variant of MAPF that continuously assigns new goals for agents to reach. LMAPF applications, such as autonomous warehouses, often require a centralized, lifelong system to coordinate the movement of a fleet of robots, typically AGVs. However, existing works on MAPF and LMAPF often assume simplified kinodynamic models, such as pebble motion, as well as perfect execution and communication for AGVs. LSMART consists of 7 modules:


1. **a planner invocation policy**: given the current states of the robots, it determines if the planner should be invoked.
2. **a MAPF problem instance generator**: given the current states of the robots, it returns the a MAPF problem instance.
3. **a MAPF planner**: given a MAPF problem instance with start and goal locations, it returns collision-free paths.
4. **a fail policy**: if the MAPF planner fails to return collision-free paths, it recovers the system from failure.
5. **an ADG**: an Action Dependency Graph (ADG) that ensures collision-free execution of the planned paths.
6. **a fleet of AGVs**: each AGV is modeled as a differentiable drive robot with realistic kinodynamics and execution uncertainties.
7. **an** `ARGoS3`_ **simulator**: the underlying physics engine that simulates the robots and the environment.

A simulation starts by using the planner invocation policy to determine whether the MAPF planner should be invoked. If so, LSMART first uses the instance generator to generate the next MAPF problem instance by computing a commit cut in the ADG to find the start states, assigning goals to AGVs, and refining the goals if necessary. At the start of the simulation, the start locations of the AGVs are randomly generated and their orientation always faces north. The instance is passed to the MAPF planner. If the planner solves it successfully, the collision-free paths are returned directly to the ADG. If it fails, the fail policy replans or resolves the collisions. Depending on the fail policy, the MAPF planner may not be required to send colliding paths to the fail policy. The paths are then converted and added to the ADG, which records a sequence of actions for each AGV with their passing orders in each location.
The AGVs and the `ARGoS3`_ simulator run in parallel with the planner. Each AGV is equipped with a PID controller and an action queue. Each agent periodically obtains actions from the ADG following the action dependencies, stores them in the action queue, and executes them in the `ARGoS3`_ simulator. If no actions are left, it waits in place. The simulation stops after a pre-defined amount of time.



.. Planner Invocation Policy
.. ++++++++++++++++

.. SMART is designed for standard MAPF, and therefore does not need an invocation policy.
.. LSMART supports two planner invocation policies, namely the periodic policy, where the planner is invoked periodically every :math:`P` seconds, and the event-based policy, where the planner is invoked when at least one AGV is expected to finish executing all its actions in the ADG before the planner returns the next time. To determine whether an AGV is finishing its actions, we pre-define a time limit of :math:`T` seconds for the planner and compute the minimal amount of time for an AGV to finish one action as :math:`\epsilon` seconds based on the kinodynamic model of the AGV. If an AGV has fewer than :math:`\frac{T}{\epsilon}` actions left in the ADG, which is the maximum number of actions the AGV can finish in :math:`T` seconds, the event-based policy invokes the planner. If the planner is to be invoked, the invocation policy awakens the instance generator to generate the next MAPF problem instance.


.. toctree::
    :maxdepth: 1
    :caption: Getting Started
    :hidden:

    Installation <install>
    Quick Start <api_py>

.. toctree::
    :maxdepth: 1
    :caption: Tutorials
    :hidden:

    MAPF Planner Integration <tutorials/mapf_planner>
    MAPF Problem Instance Generator Integration <tutorials/instance_generator>
    Planner Invocation Policy Integration <tutorials/invocation_policy>
    Fail Policy Integration <tutorials/fail_policy>

.. .. toctree::
..     :maxdepth: 1
..     :caption: API References
..     :hidden:

..     Planner-EM Communication <api_server/library_root>
.. EM-Executor Communication <api_client/library_root>

.. only:: devmode

   API docs are disabled in dev mode. Build without DOCS_DEV=1 to see them.

.. Links
.. _ARGoS3: https://github.com/ilpincy/argos3
