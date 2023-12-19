'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function KeyBinding() {
    const router = useRef(useRouter())
    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            // . and p pressed together
            if(e.key === '.' && 'p') {
                console.log('Keybinding: . and p pressed together')
                router.current.push('/projects')
            }
        })
    }, [])
    return null
}