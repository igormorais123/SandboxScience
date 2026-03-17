const isOpen = ref(false)

export function useDonationModal() {
    function open() {
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
    }

    return { isOpen, open, close }
}
