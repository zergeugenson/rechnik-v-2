<script setup lang="ts">
import { defineProps, computed } from "vue";

const props = defineProps({
  data: { type: Object, default: () => {} },
  header: { type: String, default: "" },
  rootClass: { type: String, default: "" },
});

const grammarRules = computed<number>(() => {
  return Array.from(props?.data[0])?.length;
});
</script>

<template>
  <table
    v-if="grammarRules"
    :class="['gr-table', [rootClass]]"
    class="mt-3 w-full max-w-200 mx-auto border-0 border-collapse"
  >
    <tbody>
      <tr>
        <th :colspan="grammarRules" v-html="header" />
      </tr>
      <tr v-for="(row, rowindex) in data" :key="'table-row-' + rowindex">
        <td
          v-for="(col, colindex) in row"
          :key="'table-data-' + colindex"
          :class="{ subhead: !rowindex, first: !colindex }"
          v-html="col"
        />
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
table {
  th {
    border: 1px solid $grey;
    background: $grey;
    color: $white;
    text-align: center;
    font-weight: 400;
  }
  td {
    border: 1px solid $grey;
    font-size: 0.9rem;
    padding: 0.3rem;
    width: 10rem;
    &.subhead {
      font-weight: 700;
    }
    &.first {
      width: 7rem;
      min-width: 7rem;
    }
  }
  &.margenta {
    td,
    th {
      border: 1px solid $margenta;
    }
    th {
      background: $margenta;
    }
  }
}
</style>

<style lang="scss">
table.gr-table tr td {
  span {
    background: $yellow;
    padding: 0 3px;
  }
  p {
    background: $red;
    display: inline;
    color: $white;
    padding: 0 3px;
  }
}
table.gr-table tr th {
  b {
    font-weight: 700;
  }
}
</style>
