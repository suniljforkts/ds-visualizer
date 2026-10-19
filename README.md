# Algo Studio

An interactive data structure visualizer built with React, Vite, and Tailwind CSS. Choose a structure, step through its C implementation, and follow the values and pointers in the live visualization.

## Getting started

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The code walkthrough and visualization stay side by side; use the structure selector, **Step through**, **Previous**, and **Reset** to explore an execution. Choose **Custom code** to edit or paste a C-like program and trace its statements without running the source code.

The custom tracer recognizes common `push`/`pop`, `enqueue`/`dequeue`, linked-list `insert...`/`delete...`/`remove...`/`append...`/`add...` calls in `main()`, along with array initializers and indexed assignments. Loops and conditions are shown as source steps rather than executed.

Available walkthroughs:

- Stack
- Queue
- Linked List
- Circular Queue
- Circular Linked List

## Component layout

- `src/components/Editor.jsx` contains the code editor and step controls.
- `src/components/Visualizer.jsx` composes the structure-specific visualizations.
- `Stack.jsx`, `Queue.jsx`, `CircularQueue.jsx`, `LinkedList.jsx`, and `CustomView.jsx` render the individual structures.
- `App.jsx` owns the selected structure, custom source, and trace step state.

## Checks

```sh
npm run lint
npm run build
```
