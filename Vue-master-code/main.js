// product-details component
Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
    </ul>
  `
});

// product-review component
Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        this.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        alert('Please fill out every field.');
      }
    }
  }
});

// product component
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img :src="image">
      </div>

      <div class="product-info">
        <h1>{{ fullTitle }}</h1>
        <span v-if="onSale">On Sale!</span>
        <p>{{ description }}</p>
        <p>{{ saleMessage }}</p>
        <a v-bind:href="link" target="_blank">Click here to know more about the product</a>
        <p v-if="inStock">In Stock</p>
        <p v-else v-bind:class="{ 'line-through': !inStock }">Out of Stock</p>
        <p>Shipping: {{ shipping }} </p>

        <!-- Use the product-details component here -->
        <product-details :details="details"></product-details>

        <div v-for="(variant, index) in variants" 
            :key="variant.variantId"
            class="color-box" 
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }">Add to Cart</button>

        <button v-on:click="removeFromCart"
                :disabled="cart <= 0"
                :class="{ disabledButton: cart <= 0 }">Remove from Cart</button>

        <button v-on:click="emitRemoveProduct(variants[selectedVariant].variantId)">Remove Product</button>

        <div class="cart">
          <p>Cart: {{ cart }}</p>
        </div>

        <product-review @review-submitted="addReview"></product-review>

        <div class="reviews">
          <h2>Reviews</h2>
          <p v-if="reviews.length === 0">There are no reviews yet.</p>
          <ul>
            <li v-for="(review, index) in reviews" :key="index">
              <p>{{ review.name }} gave this {{ review.rating }} stars</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
  `,
  data() {
    return {
      brand: 'Fancy',
      product: 'Socks',
      selectedVariant: 0,
      description: 'A pair of warm, fuzzy socks.',
      link: 'https://www.example.com',
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/images/socks_green.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/images/socks_blue.jpg',
          variantQuantity: 0
        }
      ],
      cart: 0,
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    emitRemoveProduct(productId) {
      this.$emit('remove-product', productId);
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
  computed: {
    fullTitle() { 
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity > 0;
    },
    saleMessage() { 
      if (this.onSale) {
        return `${this.brand} ${this.product} is on sale!`;
      }
      return '';
    },
    shipping() {
      if (this.premium) {
        return 'free';
      }
      return 2.99;
    }
  }
});

// Create the main Vue instance
var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [] // Store the products in the cart
  },
  methods: {
    removeProduct(productId) {
      // Remove the product from the cart by its ID
      this.cart = this.cart.filter(item => item !== productId);
    }
  }
});
// product-review component
Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <label>Would you recommend this product?</label>
        <input type="radio" id="yes" value="Yes" v-model="recommend">
        <label for="yes">Yes</label>
        <input type="radio" id="no" value="No" v-model="recommend">
        <label for="no">No</label>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null // New property to store the recommendation response
    };
  },
  methods: {
    onSubmit() {
      // Validate that all fields are filled out
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend // Add recommendation to the review object
        };
        this.$emit('review-submitted', productReview);
        
        // Reset form fields
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        alert('Please fill out every field, including the recommendation.');
      }
    }
  }
});