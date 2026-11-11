<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = "size-5" }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
