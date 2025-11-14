import requests
import json

# Test registration
print("Testing registration...")
response = requests.post(
    "http://localhost:8000/api/auth/register",
    json={
        "name": "Test User",
        "email": "test3@test.com",
        "password": "test123"
    }
)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test login
if response.status_code == 200:
    print("\nTesting login...")
    login_response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={
            "email": "test3@test.com",
            "password": "test123"
        }
    )
    print(f"Login Status: {login_response.status_code}")
    print(f"Login Response: {json.dumps(login_response.json(), indent=2)}")
    
    # Test getting user info
    if login_response.status_code == 200:
        token = login_response.json().get("access_token")
        print("\nTesting get user info...")
        me_response = requests.get(
            "http://localhost:8000/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Me Status: {me_response.status_code}")
        print(f"Me Response: {json.dumps(me_response.json(), indent=2)}")
