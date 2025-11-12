# Requirements: Shopping Cart System

## Overview
Build a session-based shopping cart system that allows users to add/remove items, view cart contents, update quantities, and see total pricing before checkout.

**Jira Ticket:** MBA-12
**Phase:** MVP
**Size:** Small
**Priority:** Medium

## Problem Statement
Users need a way to collect and manage music purchases before completing their order. Currently, there is no cart functionality, preventing users from buying multiple items in a single transaction.

## Goals
- Enable users to add albums and songs to a shopping cart
- Provide cart management capabilities (add, remove, update quantities)
- Show real-time pricing and totals
- Persist cart data across page navigation (session-based)
- Prepare foundation for future checkout flow

## User Stories

### As a user, I want to:
1. Add albums and songs to my cart with a single click
2. View all items in my cart with pricing details
3. Update quantities of items in my cart
4. Remove items from my cart
5. See the total price of all items in my cart
6. Have my cart persist as I navigate the site
7. See visual feedback when items are added/removed

## Functional Requirements

### Cart Operations
- **Add to Cart**: Users can add albums or individual songs to cart
- **Remove from Cart**: Users can remove any item from cart
- **Update Quantity**: Users can change the quantity of items (1-10 max)
- **View Cart**: Display all cart items with details (title, artist, price, quantity)
- **Calculate Total**: Show subtotal, tax (if applicable), and total price
- **Clear Cart**: Option to empty entire cart

### Data Storage
- Use session-based storage (no user authentication required for MVP)
- Cart persists across page navigation within same session
- Cart clears when session ends or user explicitly clears it

### Cart Item Structure
Each cart item should include:
- Item ID (album or song ID)
- Item type (album or song)
- Title
- Artist name(s)
- Price (per unit)
- Quantity
- Subtotal (price × quantity)

## Technical Requirements

### Backend
- Create cart service layer for business logic
- Implement cart controller with REST endpoints
- Store cart data in session storage
- Handle cart operations (CRUD)
- Calculate totals server-side

### API Endpoints
```
POST   /api/cart/items         - Add item to cart
GET    /api/cart               - Get cart contents
PATCH  /api/cart/items/:id     - Update item quantity
DELETE /api/cart/items/:id     - Remove item from cart
DELETE /api/cart               - Clear entire cart
```

### Frontend
- Cart icon in navigation with item count badge
- Cart dropdown/modal for quick view
- Dedicated cart page for full management
- Add to cart buttons on catalog, album, and song pages
- Real-time cart updates (optimistic UI)
- Loading states and error handling

### Data Validation
- Validate item exists before adding to cart
- Enforce quantity limits (1-10)
- Prevent duplicate items (update quantity instead)
- Validate prices match database values
- Handle concurrent cart updates

## Non-Functional Requirements

### Performance
- Cart operations complete in < 200ms
- Optimistic UI updates for instant feedback
- Efficient session storage

### User Experience
- Clear visual feedback for all cart actions
- Smooth animations for cart updates
- Responsive design (mobile-friendly)
- Accessible (keyboard navigation, ARIA labels)

### Error Handling
- Handle out-of-stock scenarios gracefully
- Display clear error messages
- Recover from failed operations
- Log errors for debugging

## Out of Scope (Future Phases)
- User authentication/persistent carts
- Wishlist functionality
- Cart sharing
- Checkout and payment processing
- Promo codes/discounts
- Inventory management

## Success Criteria
✅ Users can add albums and songs to cart
✅ Cart displays all items with accurate pricing
✅ Users can update quantities (1-10)
✅ Users can remove individual items or clear cart
✅ Cart persists across page navigation
✅ Total price calculates correctly
✅ Cart icon shows item count
✅ All operations work on mobile and desktop
✅ Error handling prevents invalid cart states

## Technical Dependencies
- Existing album and song services
- Session management middleware
- Frontend state management (React Context or similar)
- Existing UI components and design system

## Testing Requirements
- Unit tests for cart service logic
- Integration tests for cart API endpoints
- Frontend component tests for cart UI
- End-to-end tests for complete cart flow
- Edge case testing (empty cart, max quantities, invalid items)
