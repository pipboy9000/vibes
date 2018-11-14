<template>
  <div class="hello">
    Location x:<input type="text" v-model="x"><br/>
    Location y:<input type="text" v-model="y"><br/>
    Vibe title:<input type="text" v-model="title"><br/>
    Date and time:<datetime type="datetime" v-model="date"></datetime><br/>
    <button @click="save">Save</button><br/>
    Response: {{response}}<br/>
  </div>
</template>

<script>
const axios = require('axios');
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

export default {
  name: 'HelloWorld',
  components: {
    datetime: Datetime
  },
  data() {
    return {
      title: "Some title",
      x: 0,
      y: 0,
      date: '',
      response: null
    }
  },
  mounted() {
  },
  methods: {
    save() {
      axios
      .get('http://localhost:3030/save-vibe', {
        params: {
          title: this.title,
          x: this.x,
          y: this.y,
          date: this.date
        } 
      }).then(response => (this.response = response))
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
