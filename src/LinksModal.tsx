import mdiClose from '@iconify-icons/mdi/close'
import { Icon } from '@iconify/react'
import { SiX, SiTelegram } from '@icons-pack/react-simple-icons'
import DextoolsLogo from './dextools.svg?react'
import ImageDexscreener from './dexscreener.png'
import { proxy, useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'

export const appLinks = [
    {
        icon: <SiX />,
        href: 'https://x.com/DogMemeToken?t=Srudx5CHz2awSHN296IseA&s=35',
        title: 'X',
    },
    {
        icon: <SiTelegram />,
        href: 'https://t.me/Dogtokenmeme',
        title: 'Telegram',
    },
    {
        icon: <img src={ImageDexscreener} />,
        href: 'https://dexscreener.com/solana/dq37wwgg5lvxk2ohpa7styq8pc7dyddtquxysw3d2bho',
        title: 'Dexscreener',
    },
    {
        icon: <DextoolsLogo />,
        href: 'https://www.dextools.io/app/en/solana/pair-explorer/Dq37wwgg5LvXk2oHpA7sTyQ8pc7DyddTquXysw3D2BHo?t=1715715809486',
        title: 'Dextools',
    },
]

const Inner = () => {
    return (
        <div
            className="modal"
            onClick={e => {
                if (e.target !== e.currentTarget) return
                modalState.state = false
            }}
        >
            <div style={{ position: 'fixed', right: 10, top: 10, cursor: 'pointer', zIndex: 20 }}>
                <Icon onClick={() => (modalState.state = false)} icon={mdiClose} />
            </div>
            <h1 style={{ marginBottom: 20, fontSize: 32 }}>Links</h1>
            {appLinks.map(link => (
                <Link key={link.title} {...link} />
            ))}
        </div>
    )
}

export default () => {
    const { state } = useSnapshot(modalState)

    return (
        <AnimatePresence>
            {state && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ zIndex: 10 /* backdropFilter: 'blur(5px)' */ }}
                >
                    <Inner />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export const modalState = proxy({
    state: false,
})

const Link = ({ icon, href, title }) => {
    return (
        <a
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
                cursor: 'pointer',
                border: '1px solid black',
                padding: 10,
                borderRadius: 7,
                backgroundColor: 'rgb(217 0 229)',
            }}
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            <div className="small-icon">{icon}</div>
            {title}
        </a>
    )
}
