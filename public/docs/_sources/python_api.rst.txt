Python Interface
================

CLI Entry Point (`cli.py`)
---------------------------

.. code-block:: python

   def main():
       # Entry point for the CLI calculator application.
       # Parses command-line arguments and executes the calculator in either:
       # Single-expression mode (direct calculation)
       # Interactive mode (continuous input)

Usage examples:

command-line

.. code-block:: console

   $ calculator-cli "2 + 3 "
   2 + 3 = 5.0

interactive mode

.. code-block:: console

   $ calculator-cli -i
   > 10 / 2
   = 5.0
   > quit

.. code-block:: python

   def interactive_mode(calc):
       # Runs the calculator in interactive REPL (Read-Eval-Print Loop) mode.
       # Continuously prompts the user for mathematical expressions until 
       # exit command is received. Handles keyboard interrupts gracefully.
       
Features:
 - Supports exit commands: 'quit', 'exit', 'q'
 - Blank lines are ignored
 - Real-time error feedback
       
Example session:

.. code-block:: python

       #     > 5 * 5
       #     = 25.0
       #     > 7 / 0
       #     Error: Division by zero
       #     > quit
