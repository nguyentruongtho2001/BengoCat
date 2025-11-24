<template>
  <div class="card">
    <h2>Lộ trình học tập</h2>
    <div class="row">
      <div class="col">
        <label>Mục tiêu (giờ)</label>
        <input type="number" v-model.number="targetHours" min="1" max="12" />
      </div>
      <div class="col">
        <label>Thời lượng tập trung (phút)</label>
        <input type="number" v-model.number="focusMinutes" min="10" max="60" />
      </div>
    </div>
    <div class="row">
      <button @click="generate">Tạo lộ trình</button>
      <button class="secondary" @click="clearPlan">Xóa</button>
    </div>
    <div class="list">
      <div v-for="(slot,i) in plan" :key="i" class="list-item">
        <strong>{{ slot.type === 'focus' ? 'Tập trung' : 'Nghỉ' }}</strong>
        <span class="badge">{{ slot.duration }} phút</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudyRoadmap",
  data() { return { targetHours: 3, focusMinutes: 25, plan: [] }; },
  methods: {
    generate() {
      const totalMinutes = this.targetHours * 60;
      const cycle = this.focusMinutes + 5;
      const cycles = Math.floor(totalMinutes / cycle);
      this.plan = [];
      for (let i = 0; i < cycles; i++) {
        this.plan.push({ type: "focus", duration: this.focusMinutes });
        this.plan.push({ type: "break", duration: 5 });
      }
    },
    clearPlan() { this.plan = []; }
  }
};
</script>
