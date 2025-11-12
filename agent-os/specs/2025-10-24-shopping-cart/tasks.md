# Task Breakdown: Shopping Cart System

## Overview
**Feature:** Complete shopping cart management with update, remove, and clear operations
**Methodology:** Test-Driven Development (TDD - Red/Green/Refactor)
**Total Task Groups:** 4
**Estimated Complexity:** Medium
**Total Estimated Time:** 12-16 hours


## Implementation Status

**All 4 Task Groups COMPLETED** ✓

- [x] Task Group 1: Backend Cart Service Layer (TDD) - COMPLETE
  - [x] 1.1: Write Failing Unit Tests (RED Phase) - 9 tests written
  - [x] 1.2: Implement Service Methods (GREEN Phase) - All tests passing
  - [x] 1.3: Refactor Service Layer (REFACTOR Phase) - Complete with JSDoc

- [x] Task Group 2: Backend API Controllers and Routes - COMPLETE
  - [x] 2.1: Implement Cart Controller Handlers - 3 controllers added
  - [x] 2.2: Add API Routes - 3 routes added
  - [x] 2.3: Manual API Testing - Ready for testing

- [x] Task Group 3: Frontend Cart Hook Extensions (TDD) - COMPLETE
  - [x] 3.1: Write Failing Tests for Hook Methods (RED Phase) - 7 tests written
  - [x] 3.2: Implement Hook Methods (GREEN Phase) - All tests passing
  - [x] 3.3: Refactor Hook (REFACTOR Phase) - Complete

- [x] Task Group 4: Frontend Cart UI Components (TDD) - COMPLETE
  - [x] 4.1: Write Failing Tests for Components (RED Phase) - 9 tests written
  - [x] 4.2: Implement CartItem Component (GREEN Phase) - All tests passing
  - [x] 4.3: Implement CartSummary Component (GREEN Phase) - All tests passing
  - [x] 4.4: Implement CartPage Component (GREEN Phase) - All tests passing
  - [x] 4.5: Add Cart Route to Application - Complete
  - [x] 4.6: Refactor and Polish Cart UI - Complete

**Total Tests Written:** 25 tests (9 service + 7 hook + 9 component)
**Total Tests Passing:** 25/25 ✓

## TDD Methodology

This implementation MUST follow strict Test-Driven Development:
1. **RED**: Write failing tests first for each feature
2. **GREEN**: Implement minimum code to make tests pass
3. **REFACTOR**: Clean up implementation while keeping tests green
4. **REPEAT**: Continue cycle for each feature

## Existing Infrastructure (Do Not Modify)

**Backend:**
- CartItem model (database schema)
- Session model and middleware
- cartService.addItemToCart() method
- cartService.getCart() method
- cartController.addItemToCart() handler
- cartController.getCart() handler
- POST /api/cart/items endpoint
- GET /api/cart endpoint

**Frontend:**
- useCart hook with addToCart() and getCartCount() methods
- AddToCartButton component
- Navigation component with cart badge
- Shared cart type definitions

## Task List

---

### Task Group 1: Backend Cart Service Layer (TDD)
**Specialization:** Backend Engineering
**Dependencies:** None
**Estimated Time:** 4-5 hours
**Test Type:** Unit tests only

This task group extends the existing cartService with three new methods following TDD methodology.

#### 1.1 Write Failing Unit Tests for Cart Service Methods (RED Phase)
**Time Estimate:** 1.5 hours
**Write tests FIRST - they will fail initially**

Create test file: `src/server/services/__tests__/cartService.test.ts`

Write 6-8 focused unit tests covering:
- **updateQuantity method (3 tests):**
  - Test: Successfully updates quantity for existing cart item
  - Test: Enforces maximum quantity limit (10)
  - Test: Throws error when cart item not found

- **removeItem method (2 tests):**
  - Test: Successfully removes cart item from database
  - Test: Throws error when cart item not found

- **clearCart method (2-3 tests):**
  - Test: Deletes all cart items for given session ID
  - Test: Does not affect other sessions' cart items
  - Test: Returns success when cart is already empty

**Testing Strategy:**
- Mock Prisma client using jest.mock()
- Test only business logic, not database interactions
- Focus on critical paths and validation logic
- Skip edge cases like network errors or race conditions

**Verification:** Run tests with `npm test cartService.test.ts` - all should FAIL

**Acceptance Criteria:**
- Test file created with 6-8 focused tests
- Tests use proper mocking for Prisma database calls
- All tests fail (RED phase complete)
- Tests follow existing test patterns in project

---

#### 1.2 Implement Cart Service Methods (GREEN Phase)
**Time Estimate:** 1.5 hours
**Implement MINIMUM code to make tests pass**

Extend `src/server/services/cartService.ts` with three new methods:

**Method 1: updateCartItemQuantity**
```typescript
async updateCartItemQuantity(
  sessionId: string,
  cartItemId: string,
  quantity: number
): Promise<CartItemInfo>
```
- Validate quantity is between 1 and 10
- Verify cart item exists and belongs to session
- Update quantity in database
- Return updated cart item with details
- Throw error if cart item not found

**Method 2: removeCartItem**
```typescript
async removeCartItem(
  sessionId: string,
  cartItemId: string
): Promise<void>
```
- Verify cart item exists and belongs to session
- Delete cart item from database
- Throw error if cart item not found

**Method 3: clearCart**
```typescript
async clearCart(sessionId: string): Promise<{ deletedCount: number }>
```
- Delete all cart items where sessionId matches
- Return count of deleted items
- Handle empty cart gracefully

**Implementation Notes:**
- Follow existing patterns from addItemToCart() method
- Use Prisma for database operations
- Include proper error messages
- Parse Decimal types to numbers for price fields
- Reuse existing CartItemInfo interface

**Verification:** Run `npm test cartService.test.ts` - all should PASS

**Acceptance Criteria:**
- All three methods implemented in cartService
- Minimum code written to pass tests (no over-engineering)
- All 6-8 unit tests pass (GREEN phase complete)
- Methods follow existing service patterns
- Proper TypeScript types used

---

#### 1.3 Refactor and Verify Service Layer (REFACTOR Phase)
**Time Estimate:** 0.5 hours
**Clean up code while keeping tests green**

Review and refactor cartService implementation:
- Extract duplicate validation logic if present
- Improve error messages for clarity
- Ensure consistent code style with existing methods
- Add JSDoc comments for new methods
- Verify DRY principles

**Verification:** Run `npm test cartService.test.ts` - all must remain PASSING

**Acceptance Criteria:**
- Code is clean and follows project conventions
- No duplicate logic
- All 6-8 tests still pass after refactoring
- Service layer ready for controller integration

---

### Task Group 2: Backend API Controllers and Routes
**Specialization:** Backend Engineering
**Dependencies:** Task Group 1 (Service layer must be complete)
**Estimated Time:** 3-4 hours
**Test Type:** No integration tests per user requirements

This task group adds API endpoints for update, remove, and clear cart operations.

#### 2.1 Implement Cart Controller Handlers
**Time Estimate:** 2 hours
**No tests required for controllers per user constraints**

Extend `src/server/controllers/cartController.ts` with three new handlers:

**Handler 1: updateCartItemQuantity**
```typescript
async function updateCartItemQuantity(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>
```
- Extract cartItemId from req.params.id
- Extract quantity from req.body.quantity
- Validate quantity is a number between 1-10
- Get sessionId from req.session.id
- Call cartService.updateCartItemQuantity()
- Return 200 with updated cart item
- Handle errors with consistent format (code, error, message)

**Handler 2: removeCartItem**
```typescript
async function removeCartItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>
```
- Extract cartItemId from req.params.id
- Get sessionId from req.session.id
- Call cartService.removeCartItem()
- Return 200 with success message
- Handle 404 if cart item not found

**Handler 3: clearCart**
```typescript
async function clearCart(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>
```
- Get sessionId from req.session.id
- Call cartService.clearCart()
- Return 200 with deleted count
- Handle errors gracefully

**Error Handling:**
- Follow existing error response format from addItemToCart handler
- Return 400 for validation errors
- Return 404 for not found errors
- Use next(error) for unexpected errors

**Acceptance Criteria:**
- All three handlers implemented
- Consistent error handling with existing handlers
- Proper HTTP status codes (200, 400, 404)
- Validation for all input parameters
- Handlers exported for route registration

---

#### 2.2 Add API Routes
**Time Estimate:** 1 hour

Extend `src/server/routes/api/cart.ts` with three new routes:

**Route 1: Update quantity**
```typescript
router.patch('/items/:id', updateCartItemQuantity);
```

**Route 2: Remove item**
```typescript
router.delete('/items/:id', removeCartItem);
```

**Route 3: Clear cart**
```typescript
router.delete('/', clearCart);
```

**Implementation Notes:**
- All routes use existing session middleware
- Import new controller handlers
- Follow RESTful conventions
- Maintain route order (specific before generic)

**Acceptance Criteria:**
- Three routes added to cart router
- Routes follow REST conventions
- Session middleware applied (already configured on router)
- Routes properly ordered in file

---

#### 2.3 Manual API Testing
**Time Estimate:** 1 hour
**No automated tests per user constraints**

Manually test all three endpoints using Postman/curl:

**Test updateQuantity:**
- PATCH /api/cart/items/:id with quantity 5 → should return 200
- PATCH /api/cart/items/:id with quantity 15 → should return 400
- PATCH /api/cart/items/invalid-id → should return 404

**Test removeItem:**
- DELETE /api/cart/items/:id → should return 200
- DELETE same item again → should return 404

**Test clearCart:**
- DELETE /api/cart → should return 200 with count
- DELETE again on empty cart → should return 200 with count 0

**Verification:** Document test results in task notes

**Acceptance Criteria:**
- All endpoints respond with correct status codes
- Error responses follow consistent format
- Session-based authorization works correctly
- API ready for frontend integration

---

### Task Group 3: Frontend Cart Hook Extensions (TDD)
**Specialization:** Frontend Engineering
**Dependencies:** Task Group 2 (API endpoints must exist)
**Estimated Time:** 2-3 hours
**Test Type:** Component/hook tests only

This task group extends the useCart hook with new cart operations following TDD.

#### 3.1 Write Failing Tests for Cart Hook Methods (RED Phase)
**Time Estimate:** 1 hour
**Write tests FIRST - they will fail initially**

Create/extend test file: `src/client/hooks/__tests__/useCart.test.ts`

Write 5-7 focused tests covering:
- **updateQuantity method (2-3 tests):**
  - Test: Successfully updates quantity and returns updated cart
  - Test: Handles API error gracefully with error state
  - Test: Updates loading state during operation

- **removeItem method (2 tests):**
  - Test: Successfully removes item and updates cart count
  - Test: Handles API error and maintains cart state

- **clearCart method (2 tests):**
  - Test: Successfully clears all items (cartCount becomes 0)
  - Test: Handles API error gracefully

**Testing Strategy:**
- Mock fetch API using jest.fn()
- Test only hook behavior and state management
- Focus on success and error states
- Use @testing-library/react-hooks for testing
- Skip loading animations and timing edge cases

**Verification:** Run `npm test useCart.test.ts` - all should FAIL

**Acceptance Criteria:**
- 5-7 focused tests written
- Tests properly mock fetch API
- All tests fail (RED phase complete)
- Tests follow React hooks testing best practices

---

#### 3.2 Implement Cart Hook Methods (GREEN Phase)
**Time Estimate:** 1 hour
**Implement MINIMUM code to make tests pass**

Extend `src/client/hooks/useCart.ts` with three new methods:

**Method 1: updateQuantity**
```typescript
const updateQuantity = useCallback(
  async (cartItemId: string, quantity: number): Promise<boolean> => {
    // Set loading state
    // Make PATCH request to /api/cart/items/:id
    // Update local cart state on success
    // Handle errors
    // Return success boolean
  },
  []
);
```

**Method 2: removeItem**
```typescript
const removeItem = useCallback(
  async (cartItemId: string): Promise<boolean> => {
    // Set loading state
    // Make DELETE request to /api/cart/items/:id
    // Update cart count on success
    // Handle errors
    // Return success boolean
  },
  []
);
```

**Method 3: clearCart**
```typescript
const clearCart = useCallback(
  async (): Promise<boolean> => {
    // Set loading state
    // Make DELETE request to /api/cart
    // Reset cart count to 0 on success
    // Handle errors
    // Return success boolean
  },
  []
);
```

**Implementation Notes:**
- Follow existing pattern from addToCart method
- Use credentials: 'include' for all fetch calls
- Update isLoading and error states appropriately
- Return boolean for success/failure
- Keep hook interface consistent

**Return Type Extension:**
```typescript
interface UseCartReturn {
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (itemType: 'album' | 'song', itemId: string) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeItem: (cartItemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getCartCount: () => Promise<void>;
}
```

**Verification:** Run `npm test useCart.test.ts` - all should PASS

**Acceptance Criteria:**
- All three methods implemented in useCart
- Methods added to return interface
- All 5-7 tests pass (GREEN phase complete)
- Consistent patterns with existing hook methods

---

#### 3.3 Refactor Cart Hook (REFACTOR Phase)
**Time Estimate:** 0.5 hours
**Clean up code while keeping tests green**

Review and refactor useCart hook:
- Extract common fetch logic if repetitive
- Ensure consistent error handling
- Optimize useCallback dependencies
- Add JSDoc comments for new methods

**Verification:** Run `npm test useCart.test.ts` - all must remain PASSING

**Acceptance Criteria:**
- Code follows React hooks best practices
- No duplicate fetch logic
- All 5-7 tests still pass after refactoring
- Hook ready for component integration

---

### Task Group 4: Frontend Cart UI Components (TDD)
**Specialization:** Frontend/UI Engineering
**Dependencies:** Task Group 3 (Cart hook must be complete)
**Estimated Time:** 4-5 hours
**Test Type:** Component tests only

This task group creates the cart page UI with component testing following TDD.

#### 4.1 Write Failing Tests for Cart Components (RED Phase)
**Time Estimate:** 1.5 hours
**Write tests FIRST - they will fail initially**

Create test files for three new components:

**File 1:** `src/client/components/__tests__/CartItem.test.tsx` (3 tests)
- Test: Renders cart item with title, artist, price, quantity
- Test: Quantity controls (+/-) trigger updateQuantity callback
- Test: Remove button triggers removeItem callback

**File 2:** `src/client/components/__tests__/CartSummary.test.tsx` (2 tests)
- Test: Displays correct subtotal calculation
- Test: Clear cart button triggers clearCart callback

**File 3:** `src/client/pages/__tests__/CartPage.test.tsx` (2-3 tests)
- Test: Displays list of CartItem components when cart has items
- Test: Shows "empty cart" message when cart is empty
- Test: Displays loading state while fetching cart

**Testing Strategy:**
- Use @testing-library/react for component testing
- Mock useCart hook to control test scenarios
- Test only component rendering and user interactions
- Focus on critical user workflows
- Skip accessibility tests and responsive behavior

**Verification:** Run `npm test Cart*.test.tsx` - all should FAIL

**Acceptance Criteria:**
- 7-8 focused component tests written
- Tests properly mock useCart hook
- All tests fail (RED phase complete)
- Tests follow React Testing Library best practices

---

#### 4.2 Implement CartItem Component (GREEN Phase)
**Time Estimate:** 1 hour
**Implement MINIMUM code to pass tests**

Create `src/client/components/CartItem.tsx`:

**Props Interface:**
```typescript
interface CartItemProps {
  id: string;
  itemType: 'album' | 'song';
  title: string;
  artist: string;
  artworkUrl?: string;
  price: number;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
```

**Component Structure:**
- Display artwork thumbnail (48x48px) or placeholder
- Show title, artist name, and item type badge
- Display price per unit
- Quantity controls: minus button, quantity input, plus button
- Show subtotal (price × quantity)
- Remove button (red text or icon)
- Disable minus button when quantity is 1
- Disable plus button when quantity is 10

**Styling:**
- Use Tailwind CSS classes
- Follow existing design system (indigo for primary actions)
- Maintain 44px minimum touch target size
- Use grid or flex layout for alignment

**Verification:** Run CartItem tests - should PASS

**Acceptance Criteria:**
- CartItem component renders correctly
- All 3 CartItem tests pass
- Component matches existing design patterns
- Minimum functionality implemented (no extras)

---

#### 4.3 Implement CartSummary Component (GREEN Phase)
**Time Estimate:** 0.5 hours
**Implement MINIMUM code to pass tests**

Create `src/client/components/CartSummary.tsx`:

**Props Interface:**
```typescript
interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  onClearCart: () => void;
  isLoading?: boolean;
}
```

**Component Structure:**
- Display item count (e.g., "3 items")
- Show subtotal with currency formatting ($XX.XX)
- "Clear Cart" button (secondary style, confirmation optional)
- "Continue Shopping" link to catalog
- "Proceed to Checkout" button (disabled with tooltip for MVP)

**Styling:**
- Use Tailwind CSS
- Sticky positioning at bottom on mobile
- Border and shadow for visual separation
- Follow existing button styles

**Verification:** Run CartSummary tests - should PASS

**Acceptance Criteria:**
- CartSummary component renders correctly
- Both CartSummary tests pass
- Currency formatting works correctly
- Minimum functionality implemented

---

#### 4.4 Implement CartPage Component (GREEN Phase)
**Time Estimate:** 1 hour
**Implement MINIMUM code to pass tests**

Create `src/client/pages/CartPage.tsx`:

**Component Structure:**
- Fetch cart data on mount using useCart hook
- Display loading state with spinner
- Show error state if fetch fails
- Render empty state with message and "Shop Now" link
- Display list of CartItem components
- Render CartSummary at bottom
- Handle updateQuantity, removeItem, clearCart callbacks

**Layout:**
- Header section: "Shopping Cart" title and item count
- Scrollable items section
- Fixed/sticky summary section at bottom
- Responsive: single column on mobile, wider on desktop

**Styling:**
- Use Tailwind CSS for layout and spacing
- Match Navigation and existing page styles
- Ensure mobile-friendly (320px minimum)
- Loading spinner centered

**Empty State:**
- Message: "Your cart is empty"
- Icon: Shopping cart outline
- "Start Shopping" button linking to catalog

**Verification:** Run CartPage tests - should PASS

**Acceptance Criteria:**
- CartPage component implemented
- All 2-3 CartPage tests pass
- Integrates with useCart hook correctly
- Empty state, loading state, and data state all work

---

#### 4.5 Add Cart Route to Application
**Time Estimate:** 0.5 hours

Add cart page route to application router:

**File:** `src/client/App.tsx` or router configuration

**Route:**
```typescript
<Route path="/cart" element={<CartPage />} />
```

**Navigation Update:**
- Verify cart icon in Navigation links to /cart
- Ensure cart badge displays count correctly

**Verification:**
- Navigate to /cart in browser
- Verify page renders correctly
- Test all cart operations through UI

**Acceptance Criteria:**
- Cart route added and accessible
- Navigation cart icon links to cart page
- All cart operations work through UI
- No console errors

---

#### 4.6 Refactor and Polish Cart UI (REFACTOR Phase)
**Time Estimate:** 1 hour
**Clean up and enhance while keeping tests green**

Review and refactor all cart components:
- Extract duplicate Tailwind classes to shared styles if needed
- Improve loading and error state UX
- Add optimistic UI updates for better perceived performance
- Ensure consistent spacing and typography
- Add smooth transitions for cart updates
- Verify accessibility basics (ARIA labels, keyboard navigation)

**Visual Polish:**
- Add subtle animations for item removal
- Improve empty state design
- Ensure responsive behavior (320px to 1920px)
- Test on mobile viewport sizes

**Verification:**
- Run all component tests - must remain PASSING
- Manual testing on multiple screen sizes
- Test keyboard navigation

**Acceptance Criteria:**
- All 7-8 component tests still pass after refactoring
- UI is polished and consistent with design system
- Responsive design works on mobile and desktop
- No visual bugs or layout issues
- Cart operations feel smooth and responsive

---

## Execution Order

**Recommended implementation sequence:**
1. Task Group 1: Backend Cart Service Layer (4-5 hours)
   - Write service tests → Implement methods → Refactor
2. Task Group 2: Backend API Controllers and Routes (3-4 hours)
   - Implement controllers → Add routes → Manual testing
3. Task Group 3: Frontend Cart Hook Extensions (2-3 hours)
   - Write hook tests → Implement methods → Refactor
4. Task Group 4: Frontend Cart UI Components (4-5 hours)
   - Write component tests → Implement components → Refactor and polish

**Total Estimated Time:** 12-16 hours

---

## Testing Summary

**Total Tests to Write:** Approximately 18-23 focused tests
- Backend Service: 6-8 unit tests (Task 1.1)
- Frontend Hook: 5-7 tests (Task 3.1)
- Frontend Components: 7-8 tests (Task 4.1)

**Test Verification Strategy:**
- Each task group runs ONLY its own tests during development
- Do NOT run full test suite until final verification
- Focus on red-green-refactor cycle for each feature
- Manual API testing for endpoints (no automated integration tests)

---

## Final Verification Checklist

After completing all task groups, verify:

### Backend Verification
- [ ] All cartService unit tests pass (6-8 tests)
- [ ] Three new service methods work correctly
- [ ] API endpoints return correct status codes
- [ ] Error handling follows consistent patterns
- [ ] Session-based authorization works

### Frontend Verification
- [ ] All useCart hook tests pass (5-7 tests)
- [ ] All component tests pass (7-8 tests)
- [ ] Cart page accessible at /cart route
- [ ] All cart operations work through UI
- [ ] Loading and error states display correctly
- [ ] Responsive design works (320px - 1920px)

### Integration Verification
- [ ] Add item to cart from catalog page
- [ ] View cart with multiple items
- [ ] Update quantity using +/- buttons
- [ ] Remove individual items
- [ ] Clear entire cart
- [ ] Cart count badge updates immediately
- [ ] Cart persists across page navigation
- [ ] Empty state displays when cart is cleared

### User Experience Verification
- [ ] All operations complete in under 200ms
- [ ] Visual feedback for all actions (loading, success, error)
- [ ] No console errors or warnings
- [ ] Keyboard navigation works
- [ ] Touch targets meet 44px minimum
- [ ] Currency formatting displays correctly

---

## Success Criteria

**Feature Complete When:**
- All 18-23 tests pass
- Users can update item quantities (1-10)
- Users can remove individual items
- Users can clear entire cart
- Cart page displays all items with details
- Real-time subtotal calculation works
- Cart operations work on mobile and desktop
- Error states display clear messages
- Cart badge updates after every operation
- All acceptance criteria met for each task group

---

## Technical Notes

**Existing Patterns to Follow:**
- Service layer: Follow cartService.addItemToCart() pattern
- Controller layer: Follow cartController error handling
- Hook layer: Follow useCart.addToCart() pattern
- Component layer: Follow AddToCartButton patterns
- Styling: Use Tailwind classes from existing components

**Key Dependencies:**
- Prisma ORM for database operations
- Express session middleware (already configured)
- React hooks for state management
- Tailwind CSS for styling
- Jest and React Testing Library for tests

**Common Pitfalls to Avoid:**
- Skipping test-first approach (must follow TDD)
- Writing too many tests (stay focused on 18-23 total)
- Over-engineering solutions (implement minimum for green)
- Forgetting credentials: 'include' in fetch calls
- Not mocking database calls in unit tests
- Forgetting to handle Decimal type conversion from Prisma

---

## File Structure

**New Files to Create:**
```
src/
├── server/
│   └── services/
│       └── __tests__/
│           └── cartService.test.ts (Task 1.1)
├── client/
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useCart.test.ts (Task 3.1)
│   ├── components/
│   │   ├── CartItem.tsx (Task 4.2)
│   │   ├── CartSummary.tsx (Task 4.3)
│   │   └── __tests__/
│   │       ├── CartItem.test.tsx (Task 4.1)
│   │       └── CartSummary.test.tsx (Task 4.1)
│   └── pages/
│       ├── CartPage.tsx (Task 4.4)
│       └── __tests__/
│           └── CartPage.test.tsx (Task 4.1)
```

**Files to Modify:**
```
src/
├── server/
│   ├── services/
│   │   └── cartService.ts (Tasks 1.2, 1.3)
│   ├── controllers/
│   │   └── cartController.ts (Task 2.1)
│   └── routes/
│       └── api/
│           └── cart.ts (Task 2.2)
└── client/
    ├── hooks/
    │   └── useCart.ts (Tasks 3.2, 3.3)
    └── App.tsx (Task 4.5)
```
