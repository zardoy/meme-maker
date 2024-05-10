import { ComponentProps, useEffect, useRef, useState } from 'react'
import AnimatedDiv from './AnimatedDiv'
import Anime, { anime } from 'react-anime'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import mdiChevronLeft from '@iconify-icons/mdi/chevron-left'
import mdiChevronRight from '@iconify-icons/mdi/chevron-right'
import mdiShuffle from '@iconify-icons/mdi/shuffle'
import mdiDownload from '@iconify-icons/mdi/download'
import mdiContentCopy from '@iconify-icons/mdi/content-copy'
import mdiRestart from '@iconify-icons/mdi/restart'
import mdiBlock from '@iconify-icons/mdi/block'
import {} from 'valtio'
import sampleJpg from './sample.jpg'
import { noCase } from 'change-case'

export default function App() {
    return (
        <div
            style={{
                fontSize: '22px',
                color: '#522d10',
                width: '100%',
                height: '100dvh',
                background: 'rgb(140 255 140)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                gap: 20,
            }}
        >
            <div
                style={{
                    height: '100%',
                }}
            >
                <PictureControls />
            </div>
            <Pickers />
        </div>
    )
    // return <>
    //     <motion.div
    //       animate={{ scale: show ? 2 : 1 }}
    //       transition={{ duration: 0.5 }}
    //       style={{
    //         width: 100,
    //         height: 100,
    //         backgroundColor: 'blue',
    //       }}
    //     />
    //   </>
    // return <Anime opacity={[0, 1]} translateY={['-1rem', 0]} duration={2000} easing="easeOutExpo" delay={anime.stagger(100)} loop={true}>
    //     <Button>Test</Button>
    // </Anime>
}

const Pickers = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['background', 'foreground', 'accent'].map(name => (
                <PicturesPicker key={name} name={name} />
            ))}
        </div>
    )
}

const Canvas = () => {
    const ref = useRef<HTMLCanvasElement>(null)
    const size = 400

    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas!.getContext('2d')!

        const dpr = window.devicePixelRatio || 1
        canvas!.width = size * dpr
        canvas!.height = size * dpr

        ctx.clearRect(0, 0, canvas!.width, canvas!.height)
        // ctx.fillStyle = 'red'
        // ctx.fillRect(0, 0, canvas!.width, canvas!.height)
        const img = new Image()
        img.src = sampleJpg
        img.onload = () => {
            console.log(img.width)
            ctx.drawImage(img, 0, 0, canvas!.width, canvas!.height)
        }
    }, [])

    return <canvas ref={ref} style={{ width: size, height: size }} />
}

const PictureControls = () => {
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Canvas />
            <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                <Button icon={mdiRestart}>Reset</Button>
                <Button icon={mdiShuffle}>Randomize</Button>
                <Button icon={mdiContentCopy}>Copy</Button>
                <Button icon={mdiDownload}>Download</Button>
            </div>
        </div>
    )
}

const PicturesPicker = ({ name }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textTransform: 'uppercase' }}>
            <span style={{ fontSize: '0.8em' }}>{noCase(name)}:</span>
            <div style={{ display: 'flex', gap: 10 }}>
                <Button>
                    <Icon icon={mdiChevronLeft} fontSize="1.5em" />
                </Button>
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <Picker key={i} img={sampleJpg} />
                    ))}
                <Button>
                    <Icon icon={mdiChevronRight} fontSize="1.5em" />
                </Button>
            </div>
        </div>
    )
}

const Picker = ({ img }) => {
    return (
        <Button
            style={{
                padding: 5,
                width: 150,
                zIndex: 1,
                background: 'black',
            }}
        >
            {img ? (
                <img
                    draggable="false"
                    // style={{
                    //     position: 'absolute',
                    //     inset: 0,
                    // }}
                    style={{
                        zIndex: 0,
                    }}
                    src={img}
                />
            ) : (
                <Icon icon={mdiBlock} />
            )}
        </Button>
    )
}

const Button = ({ icon, ...props }: ComponentProps<typeof motion.button> & { icon? }) => {
    return (
        <motion.button
            type="button"
            {...props}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.1 },
            }}
            whileTap={{
                scale: 0.9,
            }}
            style={{
                position: 'relative',
                display: 'flex',
                gap: 5,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: 'rgb(78 255 78)',
                border: '2px solid currentColor',
                borderRadius: 25,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                ...props.style,
            }}
        >
            {icon && <Icon icon={icon} fontSize={'1.08em'} />}
            {props.children}
        </motion.button>
    )
}
