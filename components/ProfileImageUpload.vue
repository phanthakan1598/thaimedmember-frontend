<template>
  <div class="profile-upload-wrapper">
    <v-card
      class="upload-box d-flex flex-column align-center justify-center"
      flat
      :class="{ 'has-image': previewUrl, 'has-error': hasError }"
      :ripple="false"
      @click="!previewUrl && triggerFileInput()"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden-input"
        @change="onFileChange"
      >

      <template v-if="!previewUrl">
        <v-icon size="56" :color="hasError ? 'error' : 'green lighten-1'">
          mdi-image-outline
        </v-icon>
        <div class="upload-text mt-3">
          อัพโหลดรูปถ่ายที่นี่
        </div>
        <div class="upload-subtext">
          หรือ
          <span class="choose-file-link" @click.stop="triggerFileInput">เลือกไฟล์</span>
        </div>
        <div class="upload-subtext">
          จากคอมพิวเตอร์ของคุณ
        </div>
      </template>

      <template v-else>
        <div class="preview-container">
          <v-img
            :src="previewUrl"
            class="preview-image"
          />
          <v-btn
            icon
            small
            class="remove-btn"
            @click.stop="removeImage"
          >
            <v-icon color="white" small>
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-card>

    <div class="hint-text text-center mt-2">
      หมายเหตุ : รูปถ่ายขนาด 1 นิ้ว รูปถ่ายหน้าตรง ไม่สวมหมวก หรือแว่นตาดำ
    </div>

    <v-alert
      v-if="hasError"
      dense
      type="error"
      class="mt-2"
      text
    >
      {{ displayError }}
    </v-alert>
  </div>
</template>
<script>
export default {
  name: 'ProfileImageUpload',

  props: {
    // v-model support: pass in an existing image URL (string) when editing
    // a profile, or a File object when a new image was just selected.
    // (kept loose/unvalidated since `File` is a browser-only global and
    // referencing it directly breaks Nuxt's server-side render)
    value: {
      type: [String, Object],
      default: null
    },
    maxSizeMb: {
      type: Number,
      default: 5
    },
    // errors pushed in from a parent validator (e.g. vee-validate)
    errorMessages: {
      type: [String, Array],
      default: () => []
    }
  },

  data () {
    return {
      previewUrl: null,
      selectedFile: null,
      internalError: null, // errors from local validation (file type/size)
      isDragging: false
    }
  },

  computed: {
    // internal (file type/size) errors take priority over external
    // (required-field) errors, since they're more specific to what
    // the user just did
    displayError () {
      if (this.internalError) { return this.internalError }
      if (Array.isArray(this.errorMessages)) { return this.errorMessages[0] || null }
      return this.errorMessages || null
    },
    hasError () {
      return !!this.displayError
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (typeof val === 'string' && val) {
          this.previewUrl = val
        }
      }
    }
  },

  beforeDestroy () {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl)
    }
  },

  methods: {
    triggerFileInput () {
      this.$refs.fileInput.click()
    },

    onFileChange (e) {
      const file = e.target.files[0]
      if (file) { this.handleFile(file) }
      e.target.value = ''
    },

    onDragOver () {
      this.isDragging = true
    },

    onDragLeave () {
      this.isDragging = false
    },

    onDrop (e) {
      this.isDragging = false
      const file = e.dataTransfer.files[0]
      if (file) { this.handleFile(file) }
    },

    handleFile (file) {
      this.internalError = null

      if (!file.type.startsWith('image/')) {
        this.internalError = 'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น'
        return
      }

      const maxBytes = this.maxSizeMb * 1024 * 1024
      if (file.size > maxBytes) {
        this.internalError = `ขนาดไฟล์ต้องไม่เกิน ${this.maxSizeMb} MB`
        return
      }

      this.selectedFile = file
      this.previewUrl = URL.createObjectURL(file)

      this.$emit('input', file)
      this.$emit('change', { file, previewUrl: this.previewUrl })
    },

    removeImage () {
      if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.previewUrl)
      }
      this.previewUrl = null
      this.selectedFile = null
      this.internalError = null
      this.$emit('input', null)
      this.$emit('change', { file: null, previewUrl: null })
    }
  }
}
</script>

<style scoped>
.profile-upload-wrapper {
  max-width: 600px;
}

.upload-box {
  border: 2px dashed #cfd8dc;
  border-radius: 8px;
  background-color: #fafafa;
  width: 183px;
  max-height: 176px;
  padding: 32px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.upload-box:hover {
  border-color: #4caf50;
  background-color: #f5fbf5;
}

.upload-box.has-image {
  cursor: default;
  border-style: solid;
}

.hidden-input {
  display: none;
}

.upload-text {
  font-size: 16px;
  font-weight: bold;
  color: #37474f;
}

.upload-subtext {
  font-size: 13px;
  color: #90a4ae;
  line-height: 1.6;
}

.choose-file-link {
  color: #4caf50;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.choose-file-link:hover {
  text-decoration: underline;
}

.preview-container {
  max-width: 183px;
  min-height: 176px;
}

.preview-image {
    position: relative;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  min-height: 176px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.hint-text {
  font-size: 14px;
  color: #90a4ae;
}
/* .preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 220px;
}

.preview-image {
  width: 100%;
  height: 100%;
  min-height: 220px;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.hint-text {
  font-size: 12px;
  color: #90a4ae;
} */
</style>
