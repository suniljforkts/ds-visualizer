# Algo Studio

An interactive data structure visualizer built with React, Vite, and Tailwind CSS. Choose a structure, step through its C implementation, and follow the values and pointers in the live visualization.

## Getting started

```sh
npm install
npm run dev
```

Before starting the app, copy `.env.example` to `.env` and set the MySQL connection values. The API uses the existing `codevision.code` table with `code_id` and `code` columns; the table must already exist, and the configured MySQL user needs permission to alter the `code` column. On API startup, the column is widened to `VARCHAR(4096)` if needed, preserving its existing nullability, default, and character set. The complete 4,096 characters can then be saved. `npm run dev` starts the API and Vite together; the Vite development server forwards `/api` requests to the API.

Open the local URL printed by Vite. The code walkthrough and visualization stay side by side; use the structure selector, **Step through**, **Previous**, and **Reset** to explore an execution. Choose **Custom code** to select a saved program by `code_id`, edit or paste a C-like program, and trace its statements without running the source code. Each distinct edited or pasted program is autosaved as a new row; existing rows are never overwritten. Exact duplicate code triggers an alert and selects its existing `code_id` instead of saving another copy. Use **New code** to start a separate program. The editor shows the inferred structure type and reports save and connection errors.

Each step highlights its active source line. Linked-list nodes show separate **DATA** and **NEXT** fields, with the final linear-list node ending in **NULL -|**.

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
- `server/index.js` provides MySQL-backed persistence for custom source code in `codevision.code`.

## Checks

```sh
npm run lint
npm run build
```
