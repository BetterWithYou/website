#!/usr/bin/env python3
"""
Simple HTTP server for Better With You website
Run this script from the outputs directory
"""
import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🎉 Better With You website running at:")
    print(f"   http://localhost:{PORT}")
    print(f"\n📂 Serving files from: {os.getcwd()}")
    print(f"\n🛑 Press Ctrl+C to stop the server\n")
    httpd.serve_forever()
