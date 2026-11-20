# Script spine

The whole scripted pitch lives in [`spine.yaml`](spine.yaml): one entry per slide, in order. The file itself explains the fields; edit it in any text editor.

The server reloads it automatically when you save, so the operator panel updates without a restart. If a slide is invalid, for example it names a dataset that doesn't exist, the operator panel shows the error and keeps the last good version.
