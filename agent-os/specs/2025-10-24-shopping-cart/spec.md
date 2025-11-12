# Specification: Shopping Cart System

## Goal
Build a complete session-based shopping cart system that allows users to add albums and songs, manage quantities, view cart contents with real-time pricing, and prepare for future checkout functionality.

## User Stories
- As a user, I want to add albums and individual songs to my cart so I can purchase multiple items
- As a user, I want to update quantities of items in my cart so I can buy multiple copies
- As a user, I want to remove items from my cart so I can change my mind before purchasing
- As a user, I want to see the total price of my cart so I know how much I will spend
- As a user, I want my cart to persist as I browse so I don't lose my selections
- As a user, I want to clear my entire cart so I can start fresh
- As a user, I want visual feedback when adding/removing items so I know my actions succeeded

## Core Requirements

### Cart Operations
- Add albums or individual songs to cart with single click
- Update item quantities (minimum 1, maximum 10 per item)
- Remove individual items from cart
- Clear entire cart
- View all cart items with full details (title, artist, price, quantity, subtotal)
- Calculate and display subtotal in real-time
- Persist cart across page navigation within same session

### User Experience
- Cart icon in navigation header with item count badge
- Add to cart buttons on catalog, album detail, and song detail pages
- Visual feedback for successful add/remove operations
- Loading states during cart operations
- Error messages for failed operations
- Responsive design for mobile and desktop
- Keyboard navigation support

### Data Integrity
- Validate items exist before adding to cart
- Enforce quantity limits (1-10)
- Prevent duplicate cart entries (increment quantity instead)
- Store price at time of addition to cart
- Handle concurrent cart updates gracefully

## Visual Design
No mockups provided. Follow existing design system:
- Use Tailwind CSS classes matching existing components
- Match styling of AddToCartButton and Navigation components
- Use indigo-600/700 for primary actions (existing pattern)
- Use red-500 for cart badge (existing pattern)
- Maintain consistent spacing and typography

## Reusable Components

### Existing Code to Leverage

**Backend:**
- `cartService` (partial): Implements addItemToCart and getCart methods
- `cartController` (partial): Implements addItemToCart and getCart handlers
- `albumService`: Pattern for service layer architecture and data formatting
- `sessionMiddleware`: Session management already configured
- CartItem database model: Already exists in schema
- Session database model: Already exists in schema
- Error handling patterns from albumController

**Frontend:**
- `useCart` hook (partial): Implements addToCart and getCartCount
- `AddToCartButton` component: Full implementation exists
- `Navigation` component: Already displays cart count badge
- Error handling patterns from existing components
- Tailwind CSS styling conventions

**Shared:**
- API error response format (code, error, message)
- UUID validation pattern
- Type definitions structure

### New Components Required

**Backend:**
- `updateCartItemQuantity` method in cartService (update quantity operation)
- `removeCartItem` method in cartService (remove single item)
- `clearCart` method in cartService (remove all items)
- `updateCartItemQuantity` handler in cartController
- `removeCartItem` handler in cartController
- `clearCart` handler in cartController
- PATCH /api/cart/items/:id route (update quantity)
- DELETE /api/cart/items/:id route (remove item)
- DELETE /api/cart route (clear cart)

**Frontend:**
- `CartPage` component (full cart management UI)
- `CartItem` component (individual cart item display with quantity controls)
- `CartSummary` component (subtotal and cart actions)
- `updateQuantity` method in useCart hook
- `removeItem` method in useCart hook
- `clearCart` method in useCart hook
- Cart page route and rendering logic

**Shared:**
- Extended cart type definitions for frontend/backend consistency

### Why New Code Is Needed
- Existing cart implementation only supports add and view operations
- No UI exists for cart management beyond the add button
- Update, remove, and clear operations are required by requirements but not implemented
- Need dedicated cart page for full cart experience (requirements specify both quick view and dedicated page)

## Technical Approach

### Backend Extensions

**Service Layer:**
Extend cartService with three new methods following existing patterns:
- updateCartItemQuantity: Validate cart item exists, enforce quantity limits (1-10), update in database
- removeCartItem: Validate cart item belongs to session, delete from database
- clearCart: Delete all cart items for session

**Controller Layer:**
Add three new controller functions following existing error handling patterns:
- Validate input parameters (UUID format for IDs, numeric range for quantities)
- Use consistent error response format with code, error, and message fields
- Return appropriate HTTP status codes (200 for success, 400 for validation, 404 for not found)

**API Routes:**
Add three new routes to cart router:
- PATCH /api/cart/items/:id - Update quantity
- DELETE /api/cart/items/:id - Remove item
- DELETE /api/cart - Clear cart

All routes use session ID from req.session.id for authorization.

### Frontend Extensions

**Cart Page:**
Create full-page cart interface with three sections:
- Header: Cart title and item count
- Item list: Scrollable list of CartItem components
- Summary: CartSummary component with subtotal and actions

**Cart Item Component:**
Display individual cart items with:
- Artwork thumbnail (if available)
- Title and artist name
- Item type badge (Album/Song)
- Price per unit
- Quantity controls (- button, input field, + button)
- Subtotal for item
- Remove button

**Cart Summary Component:**
Display cart totals and actions:
- Item count
- Subtotal amount
- Clear cart button
- Continue shopping link
- Proceed to checkout button (disabled for MVP, prepared for future)

**State Management:**
Extend useCart hook to maintain cart state and provide methods for all operations. Use optimistic updates for immediate UI feedback, rollback on error.

### Session Management
Leverage existing express-session with PostgreSQL storage (connect-pg-simple). Session ID automatically assigned and tracked via cookies. Cart items linked to session via sessionId foreign key in CartItem model.

### Data Flow
1. User triggers cart operation (add, update, remove, clear)
2. Frontend calls useCart hook method
3. Hook makes API request with credentials: 'include'
4. Controller validates request, extracts session ID from req.session
5. Service performs business logic and database operation
6. Response sent to frontend
7. Hook updates local state and triggers re-render

## Out of Scope
- User authentication and persistent carts across devices
- Wishlist or saved for later functionality
- Cart sharing or collaborative carts
- Checkout and payment processing
- Promo codes, discounts, or coupons
- Inventory management and stock checking
- Cart abandonment emails or reminders
- Guest checkout vs logged-in checkout flows

## Success Criteria
- Users can add albums and songs to cart from any catalog page
- Cart icon displays accurate item count
- Users can view full cart with all item details
- Users can update quantities between 1-10 for any item
- Users can remove individual items from cart
- Users can clear entire cart with one action
- Cart persists across page navigation within session
- Total price calculates correctly including all items and quantities
- All cart operations complete in under 200ms
- Cart works on mobile (320px) and desktop (1920px)
- Error states display clear, actionable messages
- Cart count updates immediately after any operation
- All interactive elements meet 44px minimum touch target size
- Cart page accessible via keyboard navigation
- Screen readers can navigate and operate cart
