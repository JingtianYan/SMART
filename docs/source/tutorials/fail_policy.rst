Fail Policy Integration
+++++++++++++++++++++++++++++++

.. figure:: ../readme_assets/l-smart-2.0.png
   :alt: LSMART Pipeline
   :align: left
   :width: 100%


When the MAPF planner fails to find a solution within the time limit, the fail policy module determines how to handle the failure. The fail policy can be either a fast but suboptimal planner that replan from scratch, or a use partial solutions from the MAPF planner to generate a plan.

Our Provided Fail Policies
===========================

We provide three fail policies, including:

- **PIBT** (`Okumura et al. 2019`_): the Priority Inheritance with Backtracking.
- **LRA** (`Li et al. 2021`_): the Local Repair Guided Waits.
- **GuidedPIBT** (`Chen et al. 2024`_): Guided PIBT.

Add New Fail Policies
========================

Implementing a new fail policy requires no RPC communication since it is handled within LSMART. The fail policy shall inherit the abstract class :ref:`exhale_class_classFailPolicy` and implement the pure virtual functions defined in the class. We refer the users to :ref:`exhale_class_classPIBT` for a fail policy that replan from scratch and :ref:`exhale_class_classLRAStar` for a fail policy that uses partial solutions from the MAPF planner.

.. doxygenclass:: FailPolicy
   :project: server
   :members:
..    :protected-members:
..    :undoc-members:


.. _Li et al. 2021: https://arxiv.org/abs/2005.07371
.. _Okumura et al. 2019: https://arxiv.org/abs/1901.11282
.. _Chen et al. 2024: https://arxiv.org/abs/2308.11234