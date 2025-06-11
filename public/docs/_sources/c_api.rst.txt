C API Reference
===============

Header File: `calculate_c.h`
----------------------------

.. code-block:: c

   float add(float num1, float num2);
   float subtract(float num1, float num2);
   float multiply(float num1, float num2);
   float divide(float num1, float num2);

These functions perform basic arithmetic.

C Source: `calculate.c`
------------------------

Each function takes two `float` numbers and returns the computed result.

.. code-block:: c

   float add(float num1, float num2) {
       return num1 + num2;
   }
    float subtract(float num1, float num2) {
         return num1 - num2;
    }
    float multiply(float num1, float num2) {
         return num1 * num2;
   }

   float divide(float num1, float num2) {
       if (num2 != 0.0) {
           return num1 / num2;
       } else {
           fprintf(stderr, "Error: Division by zero\n");
           return NAN;
       }
   }

Python C API Wrapper
====================

This section documents how the core C functions are exposed to Python using the Python C API.

Wrapper Functions
-----------------

Each wrapper function takes a `PyObject*` tuple of arguments and returns a `PyObject*` representing the result.

.. code-block:: c

   PyObject* py_add(PyObject* self, PyObject* args);

Parses two floats from `args` and returns their sum as a Python float.

.. code-block:: c

   PyObject* py_subtract(PyObject* self, PyObject* args);
   PyObject* py_multiply(PyObject* self, PyObject* args);
   PyObject* py_divide(PyObject* self, PyObject* args);

The `py_divide` function raises a `ZeroDivisionError` if the second argument is zero.

Method Table
------------

The functions are registered in a method table passed to the Python interpreter:

.. code-block:: c

   static PyMethodDef calculator_methods[] = {
       {"add", py_add, METH_VARARGS, "Add two numbers"},
       {"subtract", py_subtract, METH_VARARGS, "Subtract two numbers"},
       {"multiply", py_multiply, METH_VARARGS, "Multiply two numbers"},
       {"divide", py_divide, METH_VARARGS, "Divide two numbers"},
       {NULL, NULL, 0, NULL}
   };

Module Definition and Initialization
------------------------------------

These functions are exposed in a module named `calculator_c`.

.. code-block:: c

   static struct PyModuleDef calculator_module = {
       PyModuleDef_HEAD_INIT,
       "calculator_c",
       "A simple calculator implemented in C",
       -1,
       calculator_methods
   };

   PyMODINIT_FUNC PyInit_calculator_c(void) {
       return PyModule_Create(&calculator_module);
   }

