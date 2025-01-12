<script>
import { useStore } from '@/stores/restaurantUse';
import { mapActions } from 'pinia';

export default {
  data() {
    return {
      waiters: [],
      waiter: {
        name: "",
        age: null,
        experience: 0,
        available: true,
        section: "",
        workingHours: {
          start: "",
          end: ""
        },
        skills: [],
        education: {
          degree: "",
          school: ""
        },
        certifications: [],
        performance: {
          satisfactionScore: 0,
          orderSpeed: ""
        },
        employmentStatus: "",
        startDate: "",
        tips: {
          totalTips: 0,
          distributionMethod: ""
        }
      },
      searchQuery: ''
    };
  },
  computed: {
    filteredWaiters() {
      // Arama sorgusunu küçük harfe dönüştür ve waiters listesini filtrele
      const filter = this.searchQuery.toLowerCase();
      return this.waiters.filter(waiter =>
        waiter.name.toLowerCase().includes(filter) ||
        waiter.employmentStatus.toLowerCase().includes(filter)
      );
    }
  },
  async mounted() {
    await this.updateWaiters();
  },
  methods: {
    ...mapActions(useStore, ["fetchWaiters", "addWaiter","deleteFetchWaiter"]),
    async updateWaiters() {
      try {
        this.waiters = await this.fetchWaiters();
      } catch (error) {
        console.log(error);
        alert("An error occurred while fetching waiters. Please try again.");
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
    async submitWaiterForm() {
      try {
        await this.addWaiter(this.waiter);
        alert("Waiter added successfully");
        this.waiters.push({...this.waiter}); // New waiter is added to the list
        // Reset the form after submission
        this.updateWaiters()
        this.resetWaiterForm();
      } catch (error) {
        console.log("Error adding waiter: ", error);
        alert("An error occurred while adding the waiter. Please try again.");
      }
    },
    async deleteWaiter(waiterId) {
      await this.deleteFetchWaiter(waiterId)
      await this.updateWaiters();
      alert("Waiter deleted successfully");
    },
    resetWaiterForm() {
      this.waiter = {
        name: "",
        age: null,
        experience: 0,
        available: true,
        section: "",
        workingHours: {
          start: "",
          end: ""
        },
        skills: [],
        education: {
          degree: "",
          school: ""
        },
        certifications: [],
        performance: {
          satisfactionScore: 0,
          orderSpeed: ""
        },
        employmentStatus: "",
        startDate: "",
        tips: {
          totalTips: 0,
          distributionMethod: ""
        }
      };
      this.newSkill = "";
      this.newCertification = "";
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
    <div class="w3-container w3-half w3-border w3-border-green w3-round-large w3-light-grey w3-round">
      <h2>Waiters</h2>
      <div>
        <input class="w3-input w3-margin-bottom" type="text" v-model="searchQuery" placeholder="Search waiters...">
        <p>waiters: {{ filteredWaiters.length }} </p>
          <ol class="w3-ul">
            <li v-for="waiter in filteredWaiters" :key="waiter.id">
              <a class="w3-btn w3-round-large w3-small" :href="`/waiters/${waiter._id}`">{{ waiter.name }}
                <span class="w3-tag w3-round-xxlarge" :class="statusClass(waiter.employmentStatus)">{{ waiter.employmentStatus }}</span>
              </a>
              <button class="w3-button w3-red w3-round-large w3-small w3-right w3-circle" @click="deleteWaiter(waiter._id)">Delete</button>
            </li>
          </ol>
      </div>
      <!-- <p>waiters: {{ waiters.length }} </p>
      <ol class="w3-ul">
        <li v-for="waiter in waiters" :key="waiter.id">
          <a class="w3-btn w3-round-large w3-small" :href="`/waiters/${waiter._id}`">{{ waiter.name }}
            <span class="w3-tag w3-round-xxlarge"
            :class="statusClass(waiter.employmentStatus)">{{ waiter.employmentStatus }}</span></a>
            <button class="w3-button w3-red w3-round-large w3-small w3-right w3-circle"  @click="deleteWaiter(waiter._id)">Delete</button>
        </li>
      </ol> -->
    </div>

    <div class="w3-container w3-half w3-border w3-border-green w3-round-large w3-light-grey w3-round">
      <h2>Add New Waiter</h2>
      <form @submit.prevent="submitWaiterForm" class="w3-form">
        <!--Name-->
        <p>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="waiter.name" placeholder="Enter waiter name" required class="w3-input w3-border w3-round-large">
        </p>

        <!--Age-->
        <p>
          <label for="age">Age</label>
          <input type="number" id="age" v-model="waiter.age" placeholder="Enter waiter age" required class="w3-input w3-border w3-round-large">
        </p>

        <!--Experience-->
        <p>
          <label for="experience">Experience (years)</label>
          <input type="number" id="experience" v-model="waiter.experience" min="0" placeholder="Enter waiter's experience" required class="w3-input w3-border w3-round-large">
        </p>

        <!--Available-->
        <p>
          <label for="available">Available </label>
          <input type="checkbox" id="available" v-model="waiter.available" class="w3-check">
        </p>

        <!--Section-->
        <p>
          <label for="section">Section</label>
          <select id="section" v-model="waiter.section" required class="w3-select w3-border w3-round-large">
            <option disabled value="">Pleace select a section</option>
            <option value="Bar">Bar</option>
            <option value="Dining">Dining</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Other">Other</option>
          </select>
        </p>

        <!--Working Hours-->
        <p>
          <label for="workingHours">Working Hours</label><br>
          <input type="text" id="workingHours" v-model="waiter.workingHours.start" placeholder="Start time (e.g., 09:00)" required class="w3-input w3-border w3-round-large w3-half">
          <input type="text" id="workingHours" v-model="waiter.workingHours.end" placeholder="End time (e.g., 18:00)" required class="w3-input w3-border w3-round-large w3-half">
        </p>

        <!--Skills-->
        <div>
          <label for="skills">Skills</label>
          <input type="text" id="skills" v-model="newSkill" placeholder="Add a skill" class="w3-input w3-border w3-round-large">
          <button type="button" @click="addSkill" class="w3-button w3-green w3-round-large">Add Skill</button>
          <ul>
            <li v-for="(skill, index) in waiter.skills" :key="index">
              {{ skill }}
              <button type="button" @click="removeSkill(index)" class="w3-button w3-red w3-round-large w3-small">Remove</button>
            </li>
          </ul>
        </div>

        <!--Education-->
        <p>
          <label for="education">Education</label>
          <input type="text" id="education" v-model="waiter.education.degree" placeholder="Degree" class="w3-input w3-border w3-round-large">
          <input type="text" id="school" v-model="waiter.education.school" placeholder="School" class="w3-input w3-border w3-round-large">
        </p>

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



        <!--Performance-->
        <p>
          <label for="satisfactionScore">Performance</label>
          <input type="number" id="satisfactionScore" v-model="waiter.performance.satisfactionScore" min="0" max="100" placeholder="Satisfaction Score" class="w3-input w3-border w3-round-large">
          <select name="orderSpeed" id="orderSpeed" v-model="waiter.performance.orderSpeed" required class="w3-select w3-border w3-round-large">
            <option disabled value="">Select order speed</option>
            <option value="Slow">Slow</option>
            <option value="Average">Average</option>
            <option value="Fast">Fast</option>
          </select>
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

        <!--Start Date-->
        <p>
          <label for="startDate">Start Date</label>
          <input type="text" id="startDate" v-model="waiter.startDate" placeholder="Start Date" class="w3-input w3-border w3-round-large">
        </p>

        <!--Tips-->
        <p>
          <label for="totalTips">Total Tips</label>
          <input type="number" id="totalTips" v-model="waiter.tips.totalTips" min="0" placeholder="Total Tips" class="w3-input w3-border w3-round-large">
          <select name="distributionMethod" id="distributionMethod" v-model="waiter.tips.distributionMethod" required class="w3-select w3-border w3-round-large">
            <option disabled value="">Select distribution method</option>
            <option value="Individual">Individual</option>
            <option value="Pooled">Pooled</option>
          </select>
        </p>

        <!--Submit Button-->
        <p>
          <button type="submit" class="w3-button w3-green w3-round-large">Submit</button>
        </p>
      </form>
    </div>

  </div>
</template>

<style>
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