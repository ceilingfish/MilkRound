## Brand Guidelines
The style should be clean & bright. We are aiming for something that looks simple to use (we are just ordering our milk, after all). There's a relationship here to healthy living, and supporting the local economy, so the styling should appeal to people with that kind of mindset. The key thing is the user interface should not be cluttered. Simple iconography is fine to use.

The kinds of product that we are going to be selling are things like:
* Milk
* Eggs
* Butter
* Yoghurt

Wherever possible we should use clear concise language. Avoid verbosity or hyperbole. We want it friendly and casual.

# Screen Designs

## Customer Screens

### Registration screen

This screen should contain a link "have a QR code?" to start the camera and capture a QR code. There should also be a text box where a user can enter a numeric code that was given to them by their supplier.

Entering an invalid number, or scanning an invalid QR code should bring up an error message like "That was not recognised as a valid supplier"

Style should be light & bright, with organic & natural colours

### Login/Signup Screen

**AI Design Prompt:**
```
Mobile app login screen for a milk delivery service. Clean, bright, minimal design
with lots of white space. Healthy-living aesthetic with soft, natural colours.

Elements:
- App logo at top (simple, friendly)
- "OR" divider
- Text input field labelled "Enter your code"
- Primary button "Sign In"
- Friendly tagline about local milk delivery

Style: Light background, rounded corners, simple iconography.
No clutter. Approachable and trustworthy.

This is going to be based on the Auth0 universal login, so don't get too involved.
```

---

### 2. Customer Landing Page (Upcoming Order - Editable)

**AI Design Prompt:**
```
Mobile app home screen for milk delivery service showing next scheduled order.
Clean, bright design with healthy-living aesthetic.

Elements:
- Header with delivery date "Tuesday 21st January"
- "Order deadline: 6pm Monday" subtle reminder
- Card showing order summary:
  - List of items with quantities (e.g., "2x Whole Milk", "6x Eggs")
  - Each item has - and + buttons to quickly adjust quantity
  - Simple product icons beside each item
- "Edit full order" link at bottom of card
- "Skip this delivery" button (secondary/destructive style)
- Supplier name shown subtly

Style: Minimal, card-based layout. Soft shadows. Friendly icons.
Plenty of white space. Easy tap targets for quantity adjusters.
```

---

### 3. Customer Landing Page (Order Locked - Past Deadline)

**AI Design Prompt:**
```
Mobile app home screen showing a confirmed milk delivery order that can no longer
be changed. Clean, bright design.

Elements:
- Header with delivery date
- "Order confirmed" status badge (green tick)
- Card showing order items (read-only, no quantity controls)
  - Any unavailable items shown greyed out with "Unavailable" label
- Delivery status indicator (Pending/Packed/Shipped)
- "Skip this delivery" button greyed out and disabled

Style: Minimal, informational. Calming colours. Clear visual distinction
that this is view-only. No interactive elements on order items.
```

---

### 4. New Customer - Select Delivery Days

**AI Design Prompt:**
```
Onboarding screen for new milk delivery customer to choose their delivery schedule.
Clean, bright, welcoming design.

Elements:
- Friendly header "When would you like deliveries?"
- Supplier name shown
- List or grid of available days (e.g., Mon, Wed, Fri)
  - Each day is a selectable chip/toggle
  - Unavailable days greyed out
- Brief helper text explaining they can customise items next
- "Continue" primary button at bottom

Style: Bright, encouraging. Progress indicator showing step 1 of 2.
Large tap targets. Checkbox or toggle style for day selection.
```

---

### 5. New Customer - Select Products

**AI Design Prompt:**
```
Onboarding screen for new customer to choose products for their milk delivery
subscription. Clean, minimal design.

Elements:
- Header "What would you like delivered?"
- Subtext "These items will be delivered on all your selected days"
- Scrollable product list:
  - Product name, simple icon, price
  - Quantity selector (- / number / +)
- "Different items for different days?" expandable option
- Order summary at bottom showing total
- "Confirm subscription" primary button

Style: Clean product cards. Easy quantity adjustment.
Visual product icons (milk bottle, eggs, butter). Friendly and simple.
```

---

### 6. Edit Order Screen

**AI Design Prompt:**
```
Mobile screen to edit a milk delivery order. Clean, functional design with
healthy-living aesthetic.

Elements:
- Header with supplier name and delivery date
- Toggle switch: "Just this order" / "All [Day] orders"
- Search/autocomplete field at top "Add a product..."
  - Shows dropdown suggestions when typing
- Vertical list of current order items:
  - Product icon, name, price
  - Quantity controls (- / number / +)
  - Trash icon to remove item
  - + button greys out at max quantity, - greys out at 1
- "Add a note" text area at bottom
- "Save changes" primary button

Style: Minimal, functional. Clear visual hierarchy.
Easy to scan and modify. Inline editing feel.
```

---

## Supplier Screens

### 7. Supplier - Generate Customer Code

**AI Design Prompt:**
```
Mobile screen for milk supplier to generate invitation codes for new customers.
Clean, professional but friendly design.

Elements:
- Header "Invite a customer"
- Large QR code display area (generated code)
- Text showing the unique code below QR
- "Generate new code" button
- "Share" button to send via messaging apps
- Brief instructions text

Style: Clean, bright. Professional but approachable.
Clear visual focus on the QR code.
```

---

### 8. Supplier - Delivery Run List

**AI Design Prompt:**
```
Mobile screen showing supplier's delivery schedule/route for the day.
Clean, functional design optimised for quick scanning.

Elements:
- Header with date "Deliveries for Tuesday 21st"
- Summary stats: "12 stops • 47 items"
- Scrollable list of delivery stops:
  - Customer name/address
  - Order summary (e.g., "2x Milk, 6x Eggs")
  - Status indicator (pending/delivered)
  - Tap to expand for full details
- "Start route" or map icon button
- Filter/sort options

Style: Functional, scannable. Clear typography.
Status colours (pending=neutral, delivered=green).
Optimised for outdoor/van use - high contrast, large text.
```

---

### 9. Supplier - Delivery Stop Detail

**AI Design Prompt:**
```
Mobile screen showing single delivery stop details for milk supplier.
Clean, functional design for quick reference while delivering.

Elements:
- Back arrow to return to route
- Customer name and address (large, clear)
- Map snippet or "Open in Maps" button
- Order items list with quantities
- Customer note (if any) highlighted
- "Mark as delivered" large primary button
- "Issue with delivery" secondary option

Style: High contrast, large text. Designed for quick glances.
Important info (address, items) very prominent.
Easy one-handed operation.
```