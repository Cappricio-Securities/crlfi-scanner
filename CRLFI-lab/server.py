from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import unquote

class CRLFHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Decode URL (so %0D%0A becomes \r\n)
        decoded_path = unquote(self.path)

        print(f"[DEBUG] Raw Path: {self.path}")
        print(f"[DEBUG] Decoded Path: {decoded_path}")

        # Check if payload contains CRLF injection attempt
        if "\r\nSet-Cookie:" in decoded_path:
            # Extract injected cookie
            try:
                injected_part = decoded_path.split("\r\n")[1]
                header_name, header_value = injected_part.split(":", 1)

                # Send normal response
                self.send_response(200)

                # Inject header (simulated)
                self.send_header(header_name.strip(), header_value.strip())

                self.end_headers()
                self.wfile.write(b"CRLF Injection Successful!")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())

        else:
            # Normal response
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Normal Response")

# Run server
server = HTTPServer(("localhost", 8000), CRLFHandler)
print("Server running on http://localhost:8000")
server.serve_forever()