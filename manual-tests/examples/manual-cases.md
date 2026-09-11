# Manual Test Specifications

## Suite: Product Sorting

### Test Case: TC-SORT-01 - Sort products by price low to high
- **Priority**: Normal
- **Preconditions**: User is logged in and on the inventory page
- **Steps**:
  1. Click the product sort dropdown.
  2. Select option "Price (low to high)".
  3. Verify the first product displayed has the lowest price.
- **Expected Result**: Products are arranged in ascending order of price.

### Test Case: TC-SORT-02 - Sort products by name Z to A
- **Priority**: Normal
- **Preconditions**: User is logged in and on the inventory page
- **Steps**:
  1. Click the product sort dropdown.
  2. Select option "Name (Z to A)".
  3. Verify the first product starts with the letter 'T' or later.
- **Expected Result**: Products are arranged in reverse alphabetical order.
