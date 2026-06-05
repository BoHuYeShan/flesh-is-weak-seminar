# 杂志

按周聚合的研讨班期刊。

<script setup>
import { ref } from 'vue'

const currentIssue = ref(null)

function openIssue(id) {
  currentIssue.value = id
}

function backToShelf() {
  currentIssue.value = null
}
</script>

<MagazineReader v-if="currentIssue" :issue-id="currentIssue" @back="backToShelf" />
<MagazineShelf v-else @open-issue="openIssue" />
