<template>
    <div class="group pointer-events-auto relative">
        <!-- Main tracker button -->
        <button type="button" name="Particle Tracker" aria-label="Particle Tracker" title="Track a creature"
                btn rounded-full flex items-center justify-center p-2
                class="backdrop-blur-sm z-10 relative"
                :class="isActive ? 'bg-rose-600/90 hover:bg-rose-500/90' : 'bg-rose-900/80 hover:bg-rose-800/80'"
                @click="$emit('toggle')">
            <span i-tabler-target :class="isActive ? 'text-white' : 'text-rose-300'"></span>
            <span v-if="isActive" class="absolute -top-0.5 -right-0.5 flex size-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 ring-1 ring-cyan-300/50 opacity-75"></span>
                <span class="relative inline-flex size-3 rounded-full bg-cyan-400"></span>
            </span>
        </button>
        <div v-if="isActive" class="absolute left-1/2 top-1/2 -translate-y-1/2 flex items-center h-8 rounded-r-full bg-slate-800/95 backdrop-blur-sm ring-1 ring-slate-600/50 transition-all duration-200 ease-out delay-500 group-hover:delay-0"
             :class="showInitial
                 ? 'w-21 pl-5 pr-1 opacity-100'
                 : 'w-0 opacity-0 group-hover:w-21 group-hover:pl-5 group-hover:pr-1 group-hover:opacity-100'">
            <!-- Camera Follow toggle -->
            <button type="button" title="Camera Follow" aria-label="Camera Follow"
                    class="flex items-center justify-center p-1 rounded-full ml-1.5 transition-all shrink-0"
                    :class="cameraActive 
                        ? 'bg-violet-500 hover:bg-violet-400 text-white' 
                        : 'bg-slate-600/80 hover:bg-slate-500/80 text-slate-400'"
                    @click="$emit('update:cameraActive', !cameraActive)">
                <span i-tabler-route text-sm></span>
            </button>
            <!-- Indicator toggle -->
            <button type="button" title="Show Indicator" aria-label="Show Indicator"
                    class="flex items-center justify-center p-1 rounded-full ml-1 transition-all shrink-0"
                    :class="indicatorVisible 
                        ? 'bg-teal-500 hover:bg-teal-400 text-white' 
                        : 'bg-slate-600/80 hover:bg-slate-500/80 text-slate-400'"
                    @click="$emit('update:indicatorVisible', !indicatorVisible)">
                <span i-tabler-viewfinder text-sm></span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

export default defineComponent({
    name: 'TrackerToggle',
    props: {
        isActive: {
            type: Boolean,
            required: true
        },
        cameraActive: {
            type: Boolean,
            required: true
        },
        indicatorVisible: {
            type: Boolean,
            required: true
        }
    },
    emits: ['toggle', 'update:cameraActive', 'update:indicatorVisible'],
    setup(props) {
        const showInitial = ref<boolean>(false)
        const { start, stop } = useTimeoutFn(() => {
            showInitial.value = false
        }, 3000, { immediate: false })

        watch(() => props.isActive, (newVal) => {
            if (newVal) {
                showInitial.value = true
                start()
            } else {
                showInitial.value = false
                stop()
            }
        })

        return { showInitial }
    }
})
</script>
