<template>
  <elFrame :src="nacosApi" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Nacos',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'nacosApi'
    ])
  }
}
</script>
