#!/bin/bash

# LastMile SDK - Deployment Helper Script
# This script helps with common development and deployment tasks

set -e

echo "╔═══════════════════════════════════════╗"
echo "║  LastMile SDK - Deployment Helper    ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Function to show usage
show_usage() {
  echo "Usage: ./deploy.sh [command]"
  echo ""
  echo "Commands:"
  echo "  install     - Install dependencies"
  echo "  dev         - Start development server"
  echo "  build       - Build production files"
  echo "  test        - Run tests"
  echo "  serve       - Serve example locally"
  echo "  clean       - Clean build artifacts"
  echo "  help        - Show this help message"
  echo ""
}

# Function to install dependencies
install() {
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed!"
}

# Function to start dev server
dev() {
  echo "🚀 Starting development server..."
  npm run dev
}

# Function to build
build() {
  echo "🔨 Building production files..."
  npm run build
  echo "✅ Build complete!"
}

# Function to run tests
test() {
  echo "🧪 Running tests..."
  npm test
}

# Function to serve example
serve() {
  echo "🌐 Serving example..."
  npm run serve
}

# Function to clean
clean() {
  echo "🧹 Cleaning build artifacts..."
  rm -rf node_modules
  rm -rf dist
  rm -f lastmile.min.js
  rm -f lastmile.min.js.map
  echo "✅ Cleaned!"
}

# Main script logic
case "${1:-help}" in
  install)
    install
    ;;
  dev)
    dev
    ;;
  build)
    build
    ;;
  test)
    test
    ;;
  serve)
    serve
    ;;
  clean)
    clean
    ;;
  help|--help|-h)
    show_usage
    ;;
  *)
    echo "❌ Unknown command: $1"
    echo ""
    show_usage
    exit 1
    ;;
esac
