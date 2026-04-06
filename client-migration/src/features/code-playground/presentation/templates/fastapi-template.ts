export const fastapiTemplate = {
  files: {
    "/main.py": `"""
FastAPI Application Entry Point

This is the main file for your FastAPI application.
It demonstrates routing, dependency injection, and API documentation.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime

# Create FastAPI app instance
app = FastAPI(
    title="Example API",
    description="A sample FastAPI application for learning",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database (for educational purposes)
items_db = []

@app.get("/")
async def root():
    """
    Root endpoint - returns a welcome message.
    """
    return {
        "message": "Welcome to FastAPI!",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Import routers
from routers import items, users

app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
`,
    "/models/item.py": `"""
Pydantic Models for Items

Pydantic models define the data structure and validation rules.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    """Base item model with common fields"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    is_available: bool = True

class ItemCreate(ItemBase):
    """Model for creating a new item"""
    pass

class ItemUpdate(BaseModel):
    """Model for updating an existing item"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    is_available: Optional[bool] = None

class Item(ItemBase):
    """Complete item model with ID and timestamps"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
`,
    "/routers/items.py": `"""
Items Router

Handles all item-related endpoints:
- GET /api/items - List all items
- GET /api/items/{id} - Get single item
- POST /api/items - Create new item
- PUT /api/items/{id} - Update item
- DELETE /api/items/{id} - Delete item
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from models.item import Item, ItemCreate, ItemUpdate
from datetime import datetime

router = APIRouter()

# In-memory storage (replace with database in production)
items_db: List[Item] = []
next_id = 1

@router.get("/", response_model=List[Item])
async def get_items(skip: int = 0, limit: int = 10):
    """
    Retrieve a list of items with pagination.
    """
    return items_db[skip : skip + limit]

@router.get("/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """
    Get a specific item by ID.
    """
    item = next((item for item in items_db if item.id == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found"
        )
    return item

@router.post("/", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate):
    """
    Create a new item.
    """
    global next_id
    new_item = Item(
        id=next_id,
        **item.dict(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    items_db.append(new_item)
    next_id += 1
    return new_item

@router.put("/{item_id}", response_model=Item)
async def update_item(item_id: int, item_update: ItemUpdate):
    """
    Update an existing item.
    """
    item = next((item for item in items_db if item.id == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found"
        )
    
    update_data = item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    item.updated_at = datetime.now()
    
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    """
    Delete an item by ID.
    """
    global items_db
    item = next((item for item in items_db if item.id == item_id), None)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with id {item_id} not found"
        )
    items_db = [item for item in items_db if item.id != item_id]
    return None
`,
    "/routers/users.py": `"""
Users Router

Example user management endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List

router = APIRouter()

class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool = True

# Sample users
users_db: List[User] = [
    User(id=1, username="john_doe", email="john@example.com"),
    User(id=2, username="jane_smith", email="jane@example.com"),
]

@router.get("/", response_model=List[User])
async def get_users():
    """
    Get all users.
    """
    return users_db

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """
    Get a specific user by ID.
    """
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
`,
    "/requirements.txt": `fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.4.0
`,
    "/README.md": `# FastAPI REST API

This is an educational FastAPI project demonstrating:
- RESTful API design
- Pydantic models and validation
- Dependency injection
- Automatic API documentation
- CORS middleware
- Router organization

## Project Structure

\`\`\`
project/
├── main.py              # Application entry point
├── models/              # Pydantic models
│   └── item.py
├── routers/             # API route handlers
│   ├── items.py         # Item endpoints
│   └── users.py         # User endpoints
└── requirements.txt     # Dependencies
\`\`\`

## To Run Locally

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload

# Or use:
fastapi dev main.py
\`\`\`

## API Documentation

Once running, visit:
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check
- \`GET /api/items\` - List items
- \`POST /api/items\` - Create item
- \`GET /api/items/{id}\` - Get item
- \`PUT /api/items/{id}\` - Update item
- \`DELETE /api/items/{id}\` - Delete item
- \`GET /api/users\` - List users
- \`GET /api/users/{id}\` - Get user
`,
  },
  dependencies: [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "pydantic>=2.4.0",
  ],
  description:
    "Complete FastAPI REST API with routers, Pydantic models, and automatic documentation",
};

export const fastapiExerciseStarter = `# FastAPI Exercise: Create a Todo API

# TODO: Complete the following tasks:
# 1. Create a Todo Pydantic model with title, description, completed status
# 2. Create CRUD endpoints for todos
# 3. Add query parameters for filtering completed/incomplete todos
# 4. Implement proper error handling

# Your code here:
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Define your models and endpoints below
`;
