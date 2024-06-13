<script>
export default {
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    selectCity(city) {
      this.$emit('selectCity', city);
    }
  }
};
</script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border: 1px solid #ddd;
  }
  </style>