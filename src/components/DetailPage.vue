<template>
    <div class="visible-container">
        <div class="products-wrapper">
            <div class="product" v-for="product in products" :key="product.id">
                <img :src="product.image" :alt="product.name">
                <h2 :style="{ color: product.text_color }">{{ product.name }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import HelloWorld from './HelloWorld.vue';
export default {
    // components: {
    //     HelloWorld,
    // },
    data() {
        return {
            products: [],
        };
    },
    methods: {
        goBack() {
            // логика для возврата на главную страницу
        },
        loadProducts(slug) {
            let categoryProductsUrl = `https://nlstar.com/ru/api/catalog3/v1/menutags/${slug}/`;
            axios.get(categoryProductsUrl)
                .then((response) => {
                    this.products = response.data.products;
                })
                .catch((error) => {
                    console.error(error);
                });


        },
    },
    mounted() {
        // загрузка данных категорий и подкатегорий
    },
};
</script>
<style>
.products-wrapper {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.product {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 276px;
    max-width: 100%;
    height: 494px;
    padding-top: 282px;

    img {
        position: absolute;
        height: 276px;
        width: 276px;
        top: 0;
        left: 0;
        right: 0;
    }
}
</style>