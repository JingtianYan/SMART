MAPF Planner Integration
+++++++++++++++++++++++++++++++

.. figure:: ../readme_assets/l-smart-2.0.png
   :alt: LSMART Pipeline
   :align: left
   :width: 100%


The MAPF planner takes in a MAPF problem instance with a time limit and returns collision-free paths within that time limit. The MAPF planner should return colliding paths in case of failure if the fail policy expects them.


Our Provided Planners
========================

We provide several built-in MAPF planners, including:

* **RHCR** (`Li et al. 2021`_): the Rolling Horizon Collision Resolution planner. RHCR plans for windowed paths for all robots. It supports planning with the pebble motion model and rotational motion model. RHCR is the default planner in LSMART.
* **MASS** (`Yan et al. 2025`_): the MAPF-SSIPP-SPS planner. MASS plans for full-horizon paths with 2nd order dynamics for all robots.
* **PBS** (`Ma et al. 2019`_): the Priority-Based Search planner . PBS plans for full-horizon paths for all robots. It supports planning with the pebble motion model.
* **TPBS** (`Morag et al. 2025`_): the `Transient` Priority-Based Search planner . TPBS plans for full-horizon paths for all robots even if there are duplicate goals. It supports planning with the pebble motion model.

.. _Li et al. 2021: https://arxiv.org/abs/2005.07371
.. _Yan et al. 2025: https://arxiv.org/abs/2412.13359
.. _Ma et al. 2019: https://arxiv.org/abs/1812.06356
.. _Morag et al. 2025: https://ojs.aaai.org/index.php/SOCS/article/view/35998


Detailed usage of the built-in planners can be found in the :doc:`Quick Start with Python API <../api_py>` guide.

Add New Planners
========================

The MAPF planners use RPC to communicate with other modules in LSMART. Specifically, the planner shall implement an RPC client that connects to the RPC server in LSMART. The planner shall receive a MAPF problem instance and a time limit from LSMART, and return collision-free paths within that time limit.

Check LSMART Initialization and Invocation Status
-------------------------------------------

Since RPC is a one-way communication protocol, the MAPF planner shall first check with the RPC server in LSMART whether the system is initialized and whether the planner should be invoked before attempting to receive a MAPF problem instance.

To check if other modules of LSMART are initialized, the MAPF planner shall use a RPC client to invoke the following function:

.. doxygenfunction:: rpc_api::isInitialized()

To check if the planner should be invoked, the MAPF planner shall use a RPC client to invoke the following function:

.. doxygenfunction:: rpc_api::invokePlanner()


Receive MAPF Problem Instances
---------------------------------

The MAPF planner shall use a RPC client to invoke the :doc:`getRobotsLocation <../api_server/function_server_8cpp_1ada05a9e324eac12ef00d03c8dbbd879a>` to receive a MAPF problem instance from LSMART.

.. doxygenfunction:: rpc_api::getRobotsLocation()

Return Plan Results
----------------------------

After planning, no matter success or failure, the MAPF planner shall use a RPC client to invoke the following function to return the plan results to LSMART:

.. doxygenfunction:: rpc_api::addNewPlan(string&)
