<template>
  <div class="card">
    <h2>Cài đặt</h2>
    <div class="list">
      <div class="list-item">
        <div>Ngôn ngữ</div>
        <select v-model="lang">
          <option>Tiếng Việt</option>
          <option>English</option>
        </select>
      </div>
      <div class="list-item">
        <div>Theme</div>
        <select v-model="theme">
          <option>Sáng</option>
          <option>Tối</option>
        </select>
      </div>
      <div class="list-item">
        <div>Âm thanh thông báo</div>
        <label><input type="checkbox" v-model="sound" /> Bật</label>
      </div>
    </div>
    <div class="row">
      <button @click="save">Lưu cài đặt</button>
      <button class="secondary" @click="reset">Khôi phục mặc định</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsGroup",
  data() { return { lang: "Tiếng Việt", theme: "Sáng", sound: true }; },
  methods: {
    save() { alert("Đã lưu (demo)"); },
    reset() { this.lang = "Tiếng Việt"; this.theme = "Sáng"; this.sound = true; }
  }
};
</script>
