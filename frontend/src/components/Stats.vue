<template>
  <div class="card">
    <h2>Thống kê Pomodoro</h2>
    <div class="row">
      <select v-model="range">
        <option>Hôm nay</option>
        <option>Tuần này</option>
        <option>Tháng này</option>
      </select>
      <span class="badge">Demo</span>
    </div>
    <div class="row">
      <div class="kpi">
        <div class="value">{{ totalSessions }}</div>
        <div class="label">Phiên hoàn thành</div>
      </div>
      <div class="kpi">
        <div class="value">{{ totalMinutes }}</div>
        <div class="label">Phút tập trung</div>
      </div>
      <div class="kpi">
        <div class="value">{{ streak }}</div>
        <div class="label">Chuỗi ngày</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stats",
  data() { return { range: "Tuần này", totalSessions: 18, totalMinutes: 450, streak: 5 }; }
};
</script>
