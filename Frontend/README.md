# Capstone 3 E-Commerce Fullstack
## Application Name: E-Commerce Fullstack

### URL: http://zuitt-bootcamp-prod-521-8525-pontanar.s3-website.us-east-1.amazonaws.com/

**Team Members:**  
- Augustine Grepo  
- Grace Pontanar

**User Credentials**  
- Admin User  
   - Email: batchadmin@mail.com 
   - Password: admin123

- Regular User  
   - Email: batchreguser@mail.com
   - Password: user123!

**Package installations:**   
- npm install react-router-dom
- npm install notyf
- npm install react-bootstrap bootstrap 
- install react-dom
- npm install sweetalert2
- npm install  - for member

**Backend:**   
- origin: ['http://localhost:3000']   
- http://localhost:4005/b5/
- http://ec2-18-217-117-56.us-east-2.compute.amazonaws.com/b5

#

### Features by Augustine Grepo  

**User Resources:**
- Setup the following:  
   - Modified the Login Page and Global User State
   - Added Logout Functions
   - Added Error Functions
   - Added Profile Page
   - Modified AppNavBar Page for Admin User
   - Added Reset Password on Profile Page

**Product Resources:**
- Setup the following:  
   - Added Admin Dashboard that Admin user only have the access
   - Added a Add Product Function for Admin
   - Added Edit/Update Function for Admin
   - Added Disable/Activate Product Function for Admin

**Cart Resources:**
   - Modified Product Details that Admins cannot Add To Cart

**Order Resources:**
   - Added Users Order List that Admin have only the access

#   

### Features by Grace Pontanar   

- Initial Folder Architecture Setup
- Packages Installation
   
**User Resources:**
- Adding Home page
- Adding User login and Registration
- Adding Navbar
- Modified the Profile layout

**Product Resources:**     
- Setup the following:  
   - Adding Featured Products in Home page
   - Adding products, min and max price in Product search
   - Adding Product details in Featured products and Redirect to login button if not logged in.

**Cart Resources** 
- Setup the following:   
  - Added Add to Cart in the Cart view Page 
  - Get All Cart in the Cart view Page 
  - Update quantity in the Cart view Page  
  - Added Subtotal for each item in the Cart view Page
  - Add Total price for all items in the Cart view Page
  - Added Remove item from cart button in the Cart view Page 
  - Added Clear all items from cart button in the Cart view Page
  - Modified the Cart Layout and added checked out button notyf 

**Order Resources:**
- Setup the following:   
   - Adding Order Page to view the following:    
      - Order Products
      - Checked out items with subtotal and Total price
      - Added Accordion that will allow the users to expand the orders to view the order details.
      - Added Total Spent of the user logged in.    

#

# System Flow Documentation for Capstone 3 E-Commerce Fullstack
### Overview:      
The Capstone 3 E-Commerce Fullstack application is a React-based e-commerce platform with distinct functionalities for Admin Users and Regular Users. The system allows users to browse products, manage their cart, and place orders, while admins can manage products and view user orders.
#
### User Access Flow   
**1. Home Page**   
- **File:** Home.js   
- **Features:**   
   - Displays the application name and tagline.   
   - Provides a "Browse Products" button that navigates to the product listing page (/product).   
   - Displays featured products using the FeaturedProducts component.
#
**2. User Registration**   
- **File:** Register.js   
- **Flow:**   
   - Users fill out a form with their details (first name, last name, email, mobile number, password, and confirm password).   
   - Validation ensures all fields are filled, passwords match, and the mobile number is 11 digits.   
   - On successful registration, the user is redirected to the login page.   

#
**3. User Login**   
- **File:** Login.js   
- **Flow:**   
   - Users enter their email and password.   
   - Upon successful authentication, the user's details are fetched and stored in the global UserContext.   
   - Regular users are redirected to the product listing page (/product).   

#
**4. Product Listing**   
- **File:** ProductList.js   
- **Features:**   
   - Displays all active products fetched from the backend.   
   - Provides search functionality by product name and price range.   
   - Each product card includes a "Details" button that navigates to the product details page.   

#
**5. Product Details**   
- **File:** ProductDetails.js   
- **Flow:**   
   - Displays detailed information about a selected product.   
   - Regular users can add the product to their cart by specifying a quantity.   
   - Admin users are restricted from adding products to the cart.

#
**6. Cart Management**   
- **File:** Cart.js   
- **Flow:**   
   - Displays all items in the user's cart with their quantities, subtotals, and total price.   
   - Users can:   
      - Update the quantity of items.   
      - Remove individual items.   
      - Clear the entire cart.   
      - Proceed to checkout, which creates an order and redirects to the order history page.


#
**7. Order History**   
- **File:** Orders.js   
- **Features:**   
   - Displays a list of the user's past orders.   
   - Each order includes details such as products, quantities, subtotals, and the total price.   
   - Users can expand/collapse order details using an accordion.   

#
**8. Profile Management**   
- **File:** Profile.js   
- **Features:**   
   - Displays the user's profile information (name, email, and mobile number).   
   - Includes a "Reset Password" button that allows users to update their password.   

#
**9. Logout**   
- **File:** Logout.js   
- **Flow:**   
   - Clears the user's session and redirects to the login page.

#
### Admin Access Flow
**1. Admin Dashboard**   
- **File:** AdminDashboard.js   
- **Features:**   
   - Displays a table of all products with options to:   
      - Edit product details using the EditProduct component.   
      - Disable/activate products using the ArchiveProduct component.   

   - Provides buttons to:   
      - Add a new product (/addproduct).   
      - View user orders (/user-orders).


#
**2. Add Product**   
- **File:** AddProduct.js   
- **Flow:**   
   - Admins can add new products by providing a name, description, and price.   
   - On successful creation, the admin is redirected to the product listing page.

#
**3. Edit Product** 
- **File:** EditProduct.js   
- **Flow:**   
   - Admins can update the name, description, and price of a product.   
   - Changes are saved to the backend, and the product list is refreshed.

#
**4. Disable/Activate Product**   
- **File:** ArchiveProduct.js   
- **Flow:**   
   - Admins can toggle the availability of a product (active/inactive).   
   - The product list is updated to reflect the change.

#
**5. User Orders**   
- **File:** UserOrders.js   
- **Features:**   
   - Displays all orders placed by users.   
   - Includes details such as user ID, products ordered, quantities, and total price.

#
### Shared Components
**1. App Navbar**   
- **File:** AppNavbar.js   
- **Features:**   
   - Displays navigation links based on the user's role (admin or regular user).   
   - Includes links to login, register, profile, cart, and logout.


#
**2. Reset Password**
- **File:** ResetPassword.js   
- **Features:**   
   - Allows users to update their password via a modal form.

#
### Backend Integration   
- The application communicates with the backend API using fetch calls.
- The base URL for the API is stored in the environment variable REACT_APP_API_BASE_URL.

# 
### Summary of Roles   

**Regular User**   
- Can browse products, add items to the cart, and place orders.
- Can view their order history and manage their profile.

**Admin User**   
- Has access to the Admin Dashboard.
- Can manage products (add, edit, disable/activate).
- Can view all user orders.

#

