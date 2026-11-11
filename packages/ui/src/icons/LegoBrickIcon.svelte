<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = "size-6" }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  fill="currentColor"
  class={className}
>
  <!-- Stud 1 -->
  <rect x="10" y="8" width="10" height="6" rx="2" fill="currentColor" opacity="0.9" />
  <!-- Stud 2 -->
  <rect x="28" y="8" width="10" height="6" rx="2" fill="currentColor" opacity="0.9" />
  <!-- Brick body -->
  <rect x="6" y="14" width="36" height="26" rx="3" fill="currentColor" />
  <!-- Bottom shadow/lip -->
  <rect x="6" y="36" width="36" height="4" rx="1" fill="#000000" opacity="0.2" />
</svg>
