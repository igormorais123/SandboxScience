<template>
    <label class="relative cursor-pointer inline-block">
        <input type="checkbox" class="peer sr-only" :checked="modelValue" @change="toggle"/>

        <span class="flex w-full items-center justify-between gap-3 rounded-lg border px-2 py-1.5 text-xs font-medium transition transition-duration-75 shadow-sm
                    peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-500"
              :class="modelValue ? activeClass : inactiveClass">

            <span flex items-center>
                <span v-if="icon" class="text-sm" :class="icon" mr-2></span>
                <span>{{ label }}</span>
            </span>

            <span class="text-sm" :class="modelValue ? 'i-tabler-circle-check text-green-600' : 'i-tabler-circle'"></span>
        </span>
    </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ToggleChip",
    props: {
        modelValue: { type: Boolean, required: true },
        label: { type: String, required: true },
        icon: { type: String, default: "" },
        activeClass: {
            type: String,
            default:
                "border-sky-600 bg-sky-600/20 text-sky-100",
        },
        inactiveClass: {
            type: String,
            default:
                "border-slate-600 bg-slate-800/80 text-slate-300",
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const toggle = () => {
            emit("update:modelValue", !props.modelValue);
        };

        return { toggle };
    },
});
</script>

<style scoped>

</style>