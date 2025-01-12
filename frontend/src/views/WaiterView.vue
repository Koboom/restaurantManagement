<script>
  import { useStore } from '@/stores/restaurantUse';
  import { mapActions } from 'pinia';

  export default {
    name: "WaiterView",
    data() {
      return {
        waiter: {
          skills: [],
          certifications: []
        },
        newSkill: '',
        newCertification: '',
        waiters: []
      };
    },
    async mounted() {
      await this.loadWaiter();
    },
    methods: {
      ...mapActions(useStore, ["fetchWaiter","fetchWaiters","updateWaiter"]),
      async loadWaiter() {
        try {
          this.waiter = await this.fetchWaiter(this.$route.params.waiterId);
          this.waiters = await this.fetchWaiters();
        } catch (error) {
          console.error('Error fetching waiter:', error);
        }
      },
      async submitWaiterUpdateForm() {
        try {
            await this.updateWaiter(this.waiter._id, this.waiter)
            alert("Waiter updated successfully!")
        } catch (error) {
            console.error('Error updating waiter:', error);
            alert("Error updating waiter")
        }
      },
      addSkill() {
      if (this.newSkill) {
        this.waiter.skills.push(this.newSkill);
        this.newSkill = "";
      }
      },
      removeSkill(index) {
        this.waiter.skills.splice(index, 1);
      },
      addCertification() {
      if (this.newCertification) {
        this.waiter.certifications.push(this.newCertification);
        this.newCertification = "";
      }
      },
      removeCertification(index) {
        this.waiter.certifications.splice(index, 1);
      },
      statusClass(status) {
            switch (status) {
                case 'Active':
                    return 'bg-active';
                case 'On Leave':
                    return 'bg-on-leave';
                case 'Vacation':
                    return 'bg-vacation';
                case 'Sick':
                    return 'bg-sick';
                default:
                    return '';
            }
      }
    }
  };
</script>

<template>
  <div class="w3-container w3-margin-top">
      <router-link class="w3-button w3-green w3-round-large w3-left" to="/waiters"><i class="fa fa-arrow-left"></i></router-link>
  </div>
  <div class="w3-container">
      <h3>Waiter Update Form</h3>
      <div class="w3-border w3-half w3-border-green w3-round-large w3-light-grey w3-padding">
          <div class="w3-container">
              <!-- Employment Status Etiketi -->
              <p>
                <span :class="statusClass(waiter.employmentStatus)" class="w3-tag w3-round-xxlarge w3-right">
                  {{ waiter.employmentStatus }}
                </span>
              </p>
          </div>
          <form action="" @submit.prevent="submitWaiterUpdateForm" class="w3-form">
              <p>
                <button type="submit" class="w3-button w3-green w3-round-large">Update</button>
              </p>
              <!--Name-->
              <p>
                <label for="name">Name</label>
                <input type="text" id="name" v-model="waiter.name" class="w3-input w3-border w3-round-large">
              </p>
              <!--Employment Status-->
              <p>
                <label for="employmentStatus">Employment Status</label>
                <select name="employmentStatus" id="employmentStatus" v-model="waiter.employmentStatus" required class="w3-select w3-border w3-round-large">
                  <option disabled value="">Select employment status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick</option>
                </select>
              </p>
              <!--Age-->
              <p>
                <label for="age">Age</label>
                <input type="number" id="age" v-model="waiter.age" class="w3-input w3-border w3-round-large">
              </p>
              <!--Available-->
              <p>
                  <label for="available">Available </label>
                  <input type="checkbox" id="available" v-model="waiter.available" class="w3-check">
              </p>
              <!--Experience-->
              <p>
                <label for="experience">Experience (years)</label>
                <input type="number" id="experience" v-model="waiter.experience" class="w3-input w3-border w3-round-large">
              </p>
              <!--Section-->
              <p>
                <label for="section">Section</label>
                <select name="section" v-model="waiter.section" class="w3-select w3-border w3-round-large">
                  <option disabled value="">Please select a status</option>
                  <option value="Bar">Bar</option>
                  <option value="Dining">Dining</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Other">Other</option>
                </select>
              </p>
              <!-- Skills-->
              <div>
                <label for="skills">Skills</label>
                <input type="text" id="skills" v-model="newSkill" class="w3-input w3-border w3-round-large">
                <button type="button" @click="addSkill" class="w3-button w3-green w3-round-large">Add Skill</button>
                <ul>
                    <li v-for="(skill, index) in waiter.skills" :key="index">
                        {{ skill }}
                        <button type="button" @click="removeSkill(index)" class="w3-button w3-red w3-round-large w3-small">Remove</button>
                    </li>
                </ul>
              </div>

              <!--Certifications-->
                <div>
                  <label for="certifications">Certifications</label>
                  <input type="text" id="certifications" v-model="newCertification" placeholder="Add a certification" class="w3-input w3-border w3-round-large">
                  <button type="button" @click="addCertification" class="w3-button w3-green w3-round-large">Add Certification</button>
                  <ul>
                    <li v-for="(certification, index) in waiter.certifications" :key="index">
                      {{ certification }}
                      <button class="w3-button w3-red w3-round-large w3-small" @click="removeCertification(index)">Remove</button>
                    </li>
                  </ul>
                </div>
              <!--Start Date-->
              <p>
                <label for="startDate">Start Date</label>
                <input type="text" id="startDate" v-model="waiter.startDate" placeholder="Start Date" class="w3-input w3-border w3-round-large">
              </p>
          </form>
      </div>
      <div class="w3-border w3-half w3-border-green w3-round-large w3-light-grey w3-round w3-padding">
          <p>Additional Information about the waiter</p>
          <p>Name: {{ waiter.name }} </p>
          <p>Age: {{ waiter.age }} </p>
          <p>Available: {{ waiter.available ? 'Yes' : 'No' }}</p>
          <p>Employment Status:  {{ waiter.employmentStatus }}</p>
          <p>Experience: {{ waiter.experience }} years</p>
          <p>Section: {{ waiter.section }} </p>
          <p>Skills:
              <li v-for="(skill, index) in waiter.skills" :key="index">
                          {{ skill }}
              </li>
          </p>
          <p>Certification:
              <li v-for="(certification, index) in waiter.certifications" :key="index">
                    {{ certification }}
              </li>
          </p>
          <p>Employment Status: {{ waiter.employmentStatus }}</p>
          <p>Start Date: {{ waiter.startDate }}</p>
      </div>
  </div>
</template>

<style>
  .error {
    color: red;
    font-weight: bold;
  }
  .bg-active {
    background-color: #139008;
  }
  .bg-on-leave {
    background-color: #8b1196;
  }
  .bg-vacation {
    background-color: #ec5b0c;
  }
  .bg-sick {
    background-color: #eb0d0df6;
  }
  .rating-stars {
    color: #4c4105;
    font-size: 24px;
  }
  .rating-stars .fa {
    cursor: pointer;
  }
  .rating-stars .fa.rated {
    color: #ffcc00;
  }
</style>
