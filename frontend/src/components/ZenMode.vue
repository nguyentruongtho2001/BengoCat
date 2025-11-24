<template>
  <div class="card">
    <h2>Zen Mode</h2>
    <div class="list">
      <div class="list-item">
        <label><input type="checkbox" v-model="minimal" /> Minimal UI</label>
        <div class="badge">{{ minimal ? 'Bật' : 'Tắt' }}</div>
      </div>
      <div class="list-item">
        <label><input type="checkbox" v-model="silent" /> Ẩn thông báo</label>
        <div class="badge">{{ silent ? 'Bật' : 'Tắt' }}</div>
      </div>
      <div class="list-item">
        <label>Độ mờ nền: {{ opacity }}%</label>
        <input type="range" min="20" max="100" v-model="opacity" />
      </div>
    </div>
    <button @click="enable">Kích hoạt</button>
  </div>
</template>

<script>
export default {
  name: "ZenMode",
  data() { return { minimal: true, silent: true, opacity: 80 }; },
  methods: { enable() { alert("Zen Mode bật (demo)"); } }
};
</script>
