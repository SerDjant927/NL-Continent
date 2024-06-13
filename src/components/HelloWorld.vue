<template>
  <div>
    <header class="header">
      <div class="visible-container">
        <div class="change-city-btn" @click="openModal"><svg width="11" height="16" viewBox="0 0 11 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M5.5 7C4.119 7 3 5.881 3 4.5C3 3.119 4.119 2 5.5 2C6.881 2 8 3.119 8 4.5C8 5.881 6.881 7 5.5 7ZM5.5 0C2.462 0 0 2.462 0 5.5C0 8.538 5.5 16 5.5 16C5.5 16 11 8.538 11 5.5C11 2.462 8.538 0 5.5 0Z"
              fill="#979797" />
          </svg>
          <span>{{ selectedCity }}</span>
        </div>
      </div>
    </header>
    <div class="modal-bg" :class="{ active: showModal }">
      <div class="modal" v-if="showModal">
        <div class="modal-container">
          <a class="modal-close-btn" @click="closeModal" href="javascript:void(0);">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M14.815 0L8 6.815L1.185 0L0 1.185L6.815 8L0 14.815L1.185 16L8 9.185L14.815 16L16 14.815L9.185 8L16 1.185L14.815 0Z"
                fill="#979797" />
            </svg>
          </a>
          <div class="modal-container__block modal-block">
            <div class="modal-header">
              <p class="modal-header__headline">Выбор населённого пункта:</p>
            </div>
          </div>
          <div class="modal-container__block modal-block">
            <div class="modal-block__item">
              <div class="input-wrapper">
                <input class="modal-input" list="cities" autofocus="true" type="text" v-model="selectedCity"
                  @input="searchCities" placeholder="Например, Санкт-петербург" />
                <div class="city-list-wrapper">
                  <select id="citySelect" :size="citySuggestions.length" class="city-select" v-model="selectedCityId"
                    @change="getCategoriesForSelectedCity">
                    <option v-for="city in citySuggestions" :id="city.id" :value="city.id" v-bind:key="city.id">{{
                      city.city }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-block__item">
              <button id="confirmCity" class="confirm-btn" :disabled="!selectedCityId"
                @click="confirmCity">Подтвердить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="visible-container" v-if="categoryBlock">
      <div v-if="selectedCity">
        <div class="categories">
          <div v-for="category in categories" :key="category.slug" class="category-card">
            <a href="javascript:void(0);" @click="loadProducts(category.slug)">
              <img :src="category.image" alt="Category image" />
              <h3 :style="{ color: category.text_color }">{{ category.name }}</h3>
              <p>{{ category.slug }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="visible-container">
    <div class="loading-spinner" v-if="loading">
      <img src="@/assets/loading.gif" alt="loading">
    </div>
    <div style="position: relative;" v-if="products">
      <div class="products-headline-container">
        <a class="return-btn" @click="returnBtn()">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="15" fill="#030303" />
            <path d="M21.9999 15H8.49988" stroke="white" stroke-width="2" />
            <path d="M13 10L8 15L13 20" stroke="white" stroke-width="2" />
          </svg>
        </a>
        <h1 class="product-headline">{{ headline }}</h1>
      </div>
      <div class="products-wrapper">
        <div class="products-wrapper__left">
          <ul v-if="childrens.length >= 2">
            <li @click="toggleSelected(index)" :class="{ selected: selectedIndex === index }"
              v-for="(children, index) in childrens" :id="children.id" :key="index">
              <a href="#" @click="loadProducts(children.slug)">{{ children.name }}</a>
            </li>
          </ul>
        </div>
        <div v-if="products.length > 0" class="products-wrapper__right">
          <div class="product" v-for="product in products" :key="product.id">
            <img :src="product.main_image_thumb_300" :alt="product.name">
            <p class="product__category">{{ product.category.name }}</p>
            <h2 class="product__name">{{ product.short_name }}</h2>
            <p class="product__comment">{{ product.comment_name }}</p>
            <p class="product__price">{{ product.price }} ₽</p>
            <a class="cart-add-btn cart-add-btn_disabled" href="javascript:void(0);"
              v-if="product.allowed.false || product.available.false">Нет в наличии</a>
            <a class="cart-add-btn" href="javascript:void(0);" v-else>В
              корзину</a>
          </div>
        </div>
        <div v-else>
          <h3>К сожалению, ничего не найдено</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {

    return {
      selectedCity: 'Новосибирск',
      citySuggestions: [],
      showModal: false,
      categoryBlock: true,
      selectedCityId: null,
      categories: [],
      childrens: [],
      selectedIndex: null,
      isDisabled: true,
      loading: false,
      products: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.searchCities();
      this.selectedCity = localStorage.getItem('selectedCity') || this.selectedCity;
    },
    closeModal() {
      this.showModal = false;
    },
    getCategoriesForSelectedCity() {
      let categoriesFilteredByCityUrl = `https://nlstar.com/ru/api/catalog3/v1/menutags/?city_id=${this.selectedCityId}`;
      axios.get(categoriesFilteredByCityUrl)
        .then((response) => {
          this.categories = response.data.tags;
          localStorage.setItem('categories', JSON.stringify(this.categories));
          this.selectedCity = this.citySuggestions.find(city => city.id === this.selectedCityId).city;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    selectCity(cityId) {
      const selectedCity = this.citySuggestions.find(city => city.id === cityId);

      if (selectedCity) {
        this.cityId = selectedCity.id;
        this.selectedCityId = cityId;
        this.selectedCity = selectedCity.city;
        localStorage.setItem('selectedCity', this.selectedCity);
      }
    },

    confirmCity() {
      this.selectCity(this.selectedCityId);
      this.getCategoriesForSelectedCity();
      this.closeModal();
    },

    searchCities() {
      if (this.selectedCity.length >= 3) {
        let encodedCity = encodeURIComponent(this.selectedCity);
        const citySuggestionsUrl = `https://nlstar.com/api/catalog3/v1/city/?country=ru&term=${encodedCity}`;
        axios.get(citySuggestionsUrl)
          .then((response) => {
            this.citySuggestions = response.data.data;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    loadProducts(slug) {
      let categoryProductsUrl = `https://nlstar.com/ru/api/catalog3/v1/menutags/${slug}/`;
      let allCategoriesUrl = 'https://nlstar.com/ru/api/catalog3/v1/menutags/';

      axios.get(categoryProductsUrl)
        .then((response) => {
          this.loading = true;
          this.categoryBlock = false;
          this.products = false;
          setTimeout(() => {
            this.loading = false;
            this.products = response.data.products;
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
        });
      axios.get(allCategoriesUrl)
        .then((response) => {
          this.tags = response.data.tags;
          this.index = this.tags.findIndex(tag => tag.slug === slug);
          this.childrens = this.tags[this.index].children;
          this.headline = this.tags[this.index].name;
        })
        .catch((error) => {
          console.error(error);
        });

    },
    returnBtn() {
      this.loading = false;
      this.products = false;
      this.categoryBlock = true;
      this.selectedIndex = null;
    },
    toggleSelected(index) {
      this.selectedIndex = index;
    }
  },
  mounted() {
    let storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      this.selectedCity = storedCity;
    }

    let storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      this.categories = storedCategories;
    } else {
      this.getCategoriesForSelectedCity(this.selectedCityId);
    }
  },
};

</script>

<style>
.header {
  height: 72px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 4px 0px #2727271A;
}

.visible-container {
  width: 1150px;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.change-city-btn {
  display: flex;
  align-items: center;
  column-gap: 8px;
  font-family: 'Futura PT bold';
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  color: #272727;
  cursor: pointer;
}

.category-cards {
  display: flex;
  flex-wrap: wrap;
}

.card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 5px;
}

* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
}

.city-list-wrapper {
  max-height: 300px;
  overflow: hidden;
  background-color: #fff;

}

.city-list-wrapper datalist {
  width: 100%;
  font-family: 'Futura PT light';
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  color: #979797;
  display: flex;
  row-gap: 7px;
  padding: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.city-list-wrapper datalist option:hover {
  color: #272727;
}

.city-list-wrapper datalist option:selected {
  color: #272727;
}

.city-list-wrapper ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  column-gap: 8px;
  font-family: 'Futura PT light';
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  color: #979797;
}

.city-list-wrapper ul li {
  position: relative;
}

.city-list-wrapper ul li input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  margin: 0;
  padding: 0;
}

.city-list-wrapper ul li input:checked~label {
  color: #000;
}

.city-list-wrapper ul li:hover {
  color: #000;
}

.categories {
  margin-top: 35px;
  display: flex;
  flex-wrap: wrap;
  column-gap: 22px;
  row-gap: 22px;
}

.category-card {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 152px;
  width: 271px;
  overflow: hidden;
  border-radius: 5px;
}

.category-card a {
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  text-decoration: none;
}

.category-card a img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card a h3 {
  position: relative;
  z-index: 2;
  font-family: 'Futura PT bold';
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
  margin: 0;
  padding: 20px;
}

.main {
  padding: 20px;
}

.modal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  min-height: 144px;
  height: 144px;
  width: 90vw;
  max-width: 769px;
  margin: auto;
  padding: 18px;
  ;
}

.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  column-gap: 14px;
  row-gap: 12px;
}

.modal-block {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 174px;
  column-gap: 14px;
  justify-content: center;
}

.modal-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
}

.modal-bg {
  display: none;
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: #35364780;
}

.modal-bg.active {
  display: block;
  z-index: 5;
}

.modal-header {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

.modal-header__headline {
  font-family: 'Futura PT bold';
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  margin: 0;
}

.modal-block__item {
  position: relative
}

.modal-input {
  border: 1px solid #97979780;
  width: 100%;
  height: 48px;
  font-family: 'Futura PT light';
  font-size: 18px;
  font-weight: 400;
  line-height: 23px;
  padding: 12px 16px;
  color: #979797;
  position: relative;
  z-index: 2;
}

.confirm-btn:disabled {
  width: 174px;
  height: 48px;
  border-radius: 24px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  border: 2px solid #9797974D;
  font-family: 'Futura PT bold';
  font-size: 16px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: 1.75px;
  background: #fff;
  color: #272727;
  cursor: wait;
}

.confirm-btn {
  cursor: pointer;
  background: linear-gradient(270deg, #FFA800 0%, #FF6F00 60.2%);
  color: #fff;
  width: 174px;
  height: 48px;
  border-radius: 24px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  text-transform: uppercase;
  border: 2px solid transparent;
  font-family: 'Futura PT bold';
  font-size: 16px;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: 1.75px;
}

.IsOpenModal {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  box-shadow: 0px 2px 10px 0px #97979733;
}

.products-wrapper {
  display: grid;
  column-gap: 34px;
  row-gap: 24px;
  width: 100%;
  grid-template-columns: 240px 1fr;
  justify-content: center;
  position: relative;
  padding-top: 64px;
}

.products-headline-container {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.return-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 100%;
  overflow: hidden;
  z-index: 10;
}

.product-headline {
  margin: 0;
  font-family: 'Futura PT bold';
  font-size: 44px;
  font-weight: 600;
  line-height: 44px;
  color: #272727;
}

.products-wrapper__left ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}

.products-wrapper__left ul li {
  padding: 8px 12px;
}

.products-wrapper__left ul li a {
  font-family: 'Futura PT light';
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-decoration: none;
  color: #000000;
  border-bottom: 1px solid #E9EEF3;
  display: flex;
  height: 100%;
  width: 100%;
}

.products-wrapper__left ul li a.current {
  background-color: #E9EEF3;
}

.input-wrapper {
  position: relative;
}

.city-select {
  /* position: absolute; */
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  border: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: 7px;
  padding: 0px 16px 12px;
}

.modal-input:focus+.city-select {
  display: block;
}

.city-select option {
  font-family: 'Futura PT light';
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  color: #979797;
  margin-top: 7px;
  outline: none;
}

.city-select option:nth-child(1) {
  margin-top: 0;
}

.city-select option:hover {
  color: #272727;
}

.city-select option:checked,
.city-select option:active,
.city-select option:focus {
  background-color: transparent;
  outline: none;
  counter-reset: #272727;

}

.products-wrapper__right {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  row-gap: 24px;
}

.product {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 276px;
  max-width: 100%;
  height: 494px;
  padding: 282px 32px 18px;
  background-color: #fff;
  box-shadow: 0px 2px 10px 0px #97979733;
  border-radius: 0 0 5px 5px;

  img {
    position: absolute;
    height: 276px;
    width: 276px;
    top: 0;
    left: 0;
    right: 0;
  }

  p {
    margin: 0;
  }

  h2 {
    margin: 0;
  }
}

.product__category {
  font-family: 'Futura PT light';
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  color: #979797;
}

.product__name {
  color: #272727;
  font-family: 'Futura PT bold';
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-top: 4px;
  height: 48px;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  overflow: hidden;
  -ms-line-clamp: 2;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  display: -webkit-box;
  display: box;
  word-wrap: break-word;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.product__comment {
  color: #272727;
  font-family: 'Futura PT light';
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  margin-top: 8px;
}

.product__price {
  color: #272727;
  font-family: 'Futura PT bold';
  font-size: 26px;
  font-weight: 600;
  line-height: 24px;
  margin-top: 14px;
}

.cart-add-btn {
  width: 212px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: linear-gradient(270deg, #FFA800 0%, #FF6F00 100%);
  font-family: 'Futura PT bold';
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  border: 2px solid transparent;
  border-radius: 24px;
  color: #fff;
}

.cart-add-btn.cart-add-btn_disabled {
  border: 2px solid #9797974D;
  color: #27272750;
  background: transparent;
}

.loading-spinner {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-self: center;
  margin: auto;
  width: 100vw;
  height: 100vh;
  background-color: #27272730;

  img {
    display: block;
    margin: auto;
    width: 150px;
    height: 150px;
  }
}

.selected {
  background-color: yellow;
}
</style>
