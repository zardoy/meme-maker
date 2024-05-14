import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import mdiChevronLeft from '@iconify-icons/mdi/chevron-left'
import mdiChevronRight from '@iconify-icons/mdi/chevron-right'
import mdiShuffle from '@iconify-icons/mdi/shuffle'
import mdiDownload from '@iconify-icons/mdi/download'
import mdiContentCopy from '@iconify-icons/mdi/content-copy'
import mdiRestart from '@iconify-icons/mdi/restart'
import mdiBlock from '@iconify-icons/mdi/block'
import mdiSelect from '@iconify-icons/mdi/check-bold'
import { proxy, useSnapshot } from 'valtio'
import { noCase } from 'change-case'
import assets from './assets.json'
import { useFloating, arrow, offset, FloatingArrow } from '@floating-ui/react'
import { randomSuperbWord } from 'superb'
import { SiX, SiTelegram } from '@icons-pack/react-simple-icons'
import DextoolsLogo from './dextools.svg?react'
import ImageDexscreener from './dexscreener.png'

const selectedAssets = proxy(Object.fromEntries(assets.map(k => [k.category, undefined]))) as Record<string, string | undefined>
let lastRenderedCanvas = null as HTMLCanvasElement | null
let blob = null as Blob | null

export default function App() {
    return (
        <div
            style={{
                fontSize: '20px',
                color: '#ffb503',
                textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                // width: '100vw',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                padding: '40px 10px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                gap: 0,
            }}
        >
            <h1 style={{ textAlign: 'center', fontFamily: 'Flood Std Regular', lineHeight: 0.5, marginTop: 20 }} className="title">
                {import.meta.env.VITE_APP_NAME}
                <div style={{ display: 'inline-flex', gap: 10, fontSize: '18px', alignItems: 'center', fontFamily: 'monospace' }}>
                    <span
                        onClick={e => {
                            // copy contents
                            const el = e.target as HTMLSpanElement
                            const range = document.createRange()
                            range.selectNode(el)
                            window.getSelection()!.removeAllRanges()
                            window.getSelection()!.addRange(range)
                            document.execCommand('copy')
                        }}
                    >
                        3JRTNF3WuoxK4CLTE6KC5X8iDyoJEkBBUFBq4xz7yW1w
                    </span>
                    <Link icon href={'https://x.com/DogMemeToken?t=Srudx5CHz2awSHN296IseA&s=35'} title="X">
                        <SiX />
                    </Link>
                    <Link icon href={'https://t.me/Dogtokenmeme'} title="Telegram">
                        <SiTelegram />
                    </Link>
                    <Link icon href={'https://dexscreener.com/solana/dq37wwgg5lvxk2ohpa7styq8pc7dyddtquxysw3d2bho'} title="Dexscreener">
                        <img src={ImageDexscreener} />
                    </Link>
                    <Link
                        icon
                        href={'https://www.dextools.io/app/en/solana/pair-explorer/Dq37wwgg5LvXk2oHpA7sTyQ8pc7DyddTquXysw3D2BHo?t=1715715809486'}
                        title="Dextools"
                    >
                        <DextoolsLogo />
                    </Link>
                </div>
            </h1>
            <div>
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

const Link = ({ href, children, title = '', icon = false }) => {
    return (
        <a href={href} target="_blank" title={title} rel="noreferrer noopener" className={icon ? 'small-icon' : ''}>
            {children}
        </a>
    )
}

const Pickers = () => {
    const tabs = assets.map(a => a.category)
    const [tab, setTab] = useState(tabs[0])

    const currentAssets = useMemo(() => assets.find(({ category }) => category === tab), [tab])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Tabs tabs={tabs} selected={tab} changeSelected={setTab} />
            </div>
            {currentAssets && <PicturesPicker name={currentAssets.category} urls={currentAssets.urls} />}
        </div>
    )
}

const Canvas = () => {
    const selectedAssetsVal = useSnapshot(selectedAssets)
    const ref = useRef<HTMLCanvasElement>(null)
    const _size = 300

    const [lastLayerOverride, setLastLayerOverride] = useState(null as null | { x: number; y: number })
    const [mouseDown, setMouseDown] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (lastLayerOverride) {
            console.log(lastLayerOverride)
        }

        const abortController = new AbortController()
        const draw = async () => {
            setLoading(true)
            const canvas = new OffscreenCanvas(1, 1)
            const ctx = canvas!.getContext('2d')!

            // const dpr = window.devicePixelRatio || 1
            const dpr = 2 // todo
            canvas!.width = _size * dpr
            canvas!.height = _size * dpr

            ctx.clearRect(0, 0, canvas!.width, canvas!.height)
            // ctx.fillStyle = 'red'
            // ctx.fillRect(0, 0, canvas!.width, canvas!.height)
            const inFront = ['Background', 'Back Accessory']
            const inBack = ['Front Accessory', 'Face', 'Hat']
            const getOffset = url => {
                if (url === 'bg.png') return { x: 15, y: 15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'ans') return { x: 0, y: -20 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'animeface') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'beat_eyes') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'cheek') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'cute') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'cute_anime_eyes') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'cute_eyes') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'happy_eyes') return { x: -15, y: -17 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'heisenbeard') return { x: -15, y: -15 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'mask') return { x: -5, y: 0 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'mouth') return { x: -5, y: 0 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'smile') return { x: -5, y: 0 }
                if (url.split('/').pop().split('.')[0].toLowerCase() === 'white_beard') return { x: -5, y: 0 }
                // const override = assets.find(({ urls }) => urls.includes(url))?.offset
                return { x: 0, y: 0 }
            }
            const images = [
                ...inFront.map(x => selectedAssets[x]),
                'bg.png',
                ...Object.entries(selectedAssets)
                    .filter(([k]) => !inFront.includes(k) && !inBack.includes(k))
                    .map(([k, v]) => v),
                ...inBack.map(x => selectedAssets[x]),
            ]
            console.debug(images)
            for (const image of images) {
                if (!image) continue
                const img = new Image()
                img.src = image
                await new Promise<void>(resolve => {
                    img.onload = () => {
                        const { x, y } = (image === images[images.length - 1] ? lastLayerOverride : null) ?? getOffset(image)
                        ctx.drawImage(img, x, y, canvas!.width, canvas!.height)
                        resolve()
                    }
                })
            }
            if (abortController.signal.aborted) return
            ref.current!.width = canvas.width
            ref.current!.height = canvas.height
            ref.current!.getContext('2d')!.drawImage(canvas, 0, 0, canvas.width, canvas.height)
            lastRenderedCanvas = ref.current!
            blob = await new Promise<Blob | null>(resolve => {
                ref.current!.toBlob(resolve)
            })
            setLoading(false)
        }
        draw()

        return () => abortController.abort()
    }, [selectedAssetsVal, lastLayerOverride])

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={ref}
                style={{ width: _size, height: _size }}
                onMouseDown={e => {
                    if (e.altKey) {
                        setMouseDown(true)
                    }
                }}
                onMouseMove={e => {
                    if (mouseDown) {
                        const boundingClientRect = ref.current!.getBoundingClientRect()
                        setLastLayerOverride({
                            x: e.clientX - boundingClientRect.left - _size / 2,
                            y: e.clientY - boundingClientRect.top,
                        })
                    }
                }}
                onMouseUp={() => {
                    setMouseDown(false)
                }}
            />
            {loading && <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 16 }}>Loading...</div>}
        </div>
    )
}

const PictureControls = () => {
    const functions = {
        reset() {
            for (const key in selectedAssets) {
                selectedAssets[key] = undefined
            }
        },
        randomize() {
            for (const asset of assets) {
                selectedAssets[asset.category] = asset.urls[Math.floor(Math.random() * asset.urls.length)]
            }
        },
        download() {
            const canvas = lastRenderedCanvas
            if (!canvas) return
            const link = document.createElement('a')
            link.href = canvas.toDataURL('image/png')
            link.download = `${randomSuperbWord()}_dog.png`
            link.click()
        },
        async copy() {
            const canvas = lastRenderedCanvas
            if (!canvas) return
            try {
                if (!blob) throw new Error('no blob')
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob,
                    }),
                ])
            } catch (err) {
                console.log(err)
                alert('Failed to copy to clipboard :(')
            }
        },
    }

    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <Canvas />
            <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                <Button icon={mdiRestart} onClick={functions.reset}>
                    Reset
                </Button>
                <Button icon={mdiShuffle} onClick={functions.randomize}>
                    Randomize
                </Button>
                <Button icon={mdiContentCopy} onClick={functions.copy}>
                    Copy to Clipboard
                </Button>
                <Button icon={mdiDownload} onClick={functions.download}>
                    Download
                </Button>
            </div>
        </div>
    )
}

const Tabs = ({ tabs, selected, changeSelected }) => {
    return (
        <div style={{ display: 'flex', gap: 0, overflow: 'auto', padding: '10px 5px' }}>
            {tabs.map((tab, i, tabs) => {
                const isFirst = tab === tabs[0]
                const isLast = tab === tabs[tabs.length - 1]
                const isSelected = tab === selected
                return (
                    <Button
                        key={tab}
                        onClick={() => changeSelected(tab)}
                        style={{
                            // borderRadius: 0,
                            borderTopLeftRadius: isFirst ? undefined : 0,
                            borderBottomLeftRadius: isFirst ? undefined : 0,
                            borderLeft: isFirst ? undefined : 'none',
                            borderRight: isLast ? undefined : 'none',
                            borderTopRightRadius: isLast ? undefined : 0,
                            borderBottomRightRadius: isLast ? undefined : 0,
                            transition: 'background 0.2s',
                            background: !isSelected ? undefined : 'rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {tab}
                    </Button>
                )
            })}
        </div>
    )
}

const PicturesPicker = ({ name, urls }) => {
    const selectedValue = useSnapshot(selectedAssets)[name]
    const container = useRef<HTMLDivElement>(null!)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const scroll = (direction: 'left' | 'right') => {
        const ref = container.current
        const scrollAmount = 200
        ref.scrollTo({
            left: direction === 'left' ? ref.scrollLeft - scrollAmount : ref.scrollLeft + scrollAmount,
            behavior: 'smooth',
        })
    }

    const onScroll = () => {
        const ref = container.current
        setCanScrollLeft(ref.scrollLeft > 0)
        setCanScrollRight(ref.scrollLeft + ref.offsetWidth < ref.scrollWidth)
    }

    useEffect(() => {
        onScroll()
    }, [])

    return (
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', width: '100%', height: '100%' }}>
            <Button onClick={() => scroll('left')} disabled={!canScrollLeft} style={{ height: '150px', marginTop: 20, touchAction: 'manipulation' }}>
                <Icon icon={mdiChevronLeft} fontSize="1.5em" />
            </Button>
            <div
                ref={container}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    textTransform: 'uppercase',
                    overflow: 'auto',
                    width: '100%',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
                onScroll={onScroll}
            >
                <span style={{ fontSize: '0.9em' }}>{noCase(name)}:</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    {urls.map((url, i) => {
                        const isSelected = selectedValue === url
                        return (
                            <Picker
                                selected={isSelected}
                                key={i}
                                img={url}
                                onClick={() => {
                                    selectedAssets[name] = isSelected ? undefined : url
                                }}
                            />
                        )
                    })}
                </div>
            </div>
            <Button onClick={() => scroll('right')} disabled={!canScrollRight} style={{ height: '150px', marginTop: 20, touchAction: 'manipulation' }}>
                <Icon icon={mdiChevronRight} fontSize="1.5em" />
            </Button>
        </div>
    )
}

const Picker = ({ img, onClick, selected }) => {
    const ARROW_HEIGHT = 7
    const GAP = 0

    const [hovered, setHovered] = useState(false)

    const arrowRef = useRef<any>(null)
    const { refs, floatingStyles, context } = useFloating({
        middleware: [
            arrow({
                element: arrowRef,
            }),
            offset(ARROW_HEIGHT + GAP),
        ],
        placement: 'top',
    })

    useEffect(() => {
        if (selected) {
            const ref = refs.reference.current as HTMLButtonElement
            // scroll only X
            const parent = ref.parentElement!.parentElement!
            const left = ref.offsetLeft - parent.offsetWidth / 2 + ref.offsetWidth / 2
            parent.scrollTo({
                left,
                behavior: 'smooth',
            })
            context.update()
        }
    }, [selected])

    return (
        <Button
            style={{
                padding: 5,
                width: 150,
                zIndex: 1,
                background: 'none',
                flexShrink: 0,
                border: selected ? '2px solid lime' : '2px solid currentColor',
                // background: 'black',
                position: 'relative',
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            rootRef={refs.setReference}
        >
            {selected && (
                <Icon
                    icon={mdiSelect}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: 'lime',
                        fontSize: '1.5em',
                        zIndex: 1,
                    }}
                />
            )}
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
            <div
                ref={refs.setFloating}
                style={{
                    ...floatingStyles,
                    background: 'rgba(0, 0, 0, 0.3)',
                    // fontSize: 8,
                    pointerEvents: 'none',
                    userSelect: 'text',
                    padding: '2px 4px',
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    textShadow: '1px 1px 2px BLACK',
                    zIndex: 11,
                    whiteSpace: 'nowrap',
                }}
            >
                {img ? noCase(img.split('/').pop().split('.')[0]) : 'None'}
                <FloatingArrow ref={arrowRef} context={context} style={{ opacity: 0.7 }} />
            </div>
        </Button>
    )
}

const Button = ({ icon, itemRef, rootRef, disabled, ...props }: ComponentProps<typeof motion.button> & { icon?; rootRef? }) => {
    return (
        <motion.button
            type="button"
            {...props}
            disabled={disabled}
            ref={rootRef}
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
                gap: 10,
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 20px',
                backgroundColor: 'rgb(242 0 255)',
                border: '2px solid currentColor',
                borderRadius: 5,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                textShadow: 'inherit',
                opacity: disabled ? 0.5 : 1,
                ...props.style,
            }}
        >
            {props.children}
            {icon && <Icon icon={icon} fontSize={'1.08em'} />}
        </motion.button>
    )
}
