![Full Logo](https://github.com/KvRae/MachInNav-Engine-Docs/assets/58667227/0c18324c-3cbd-4453-a7a3-84948052b778)

# MINE - Machinestalk Indoor Navigation Engine

[![Build Status](https://github.com/KvRae/docs-generation/actions/workflows/main.yml/badge.svg)](https://github.com/KvRae/docs-generation/actions)
[![Python Version](https://img.shields.io/badge/python-3.8%20%7C%203.9-blue)](https://www.python.org/downloads/)
[![MkDocs Version](https://img.shields.io/badge/mkdocs-1.2.2-blue)](https://www.mkdocs.org/)
[![Material Version](https://img.shields.io/badge/material-7.0.0-blue)](https://squidfunk.github.io/mkdocs-material/)
## Introduction
this is the documentation made using material for Mk docs a powerful static site generator that's geared towards building project documentation.
Documentation source files are written in Markdown, and configured with a single YAML configuration file.

## Pre-requisites
- Python 3.8 or higher
- Github cli or git
- Code editor (Webstorm, VS Code, Sublime Text, etc)

## Installation
- Using pip:
- 
```bash
pip install mkdocs-material
```
This will automatically install compatible versions of all dependencies: MkDocs, Markdown, Pygments and Python Markdown Extensions.

- Using docker:
```bash
docker pull squidfunk/mkdocs-material
```

- Using git:
```bash
git clone https://github.com/squidfunk/mkdocs-material.git
cd mkdocs-material
pip install -e .
```

## Usage
MkDocs material is built on top of MkDocs, which is uses python markdown to convert markdown files to html.

inside the project directory, run the following command:
```bash
python -m venv env
```

then activate the virtual environment:
```bash
source env/bin/activate
```

then run the server:
```bash
mkdocs serve
```

Congratulations! you have successfully run the server, now you can access the documentation

## Deployment
this project contains a github action that will automatically deploy the documentation to github pages when a new commit is pushed to the main branch.
you can find the github action file in the .github/workflows directory.

Happy coding!




