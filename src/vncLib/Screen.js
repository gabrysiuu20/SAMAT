import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
  } from "react"
  import RFB from "../noVNC/core/rfb"
  
  export let Events
  
  ;(function(Events) {
    Events[(Events["connect"] = 0)] = "connect"
    Events[(Events["disconnect"] = 1)] = "disconnect"
    Events[(Events["credentialsrequired"] = 2)] = "credentialsrequired"
    Events[(Events["securityfailure"] = 3)] = "securityfailure"
    Events[(Events["clipboard"] = 4)] = "clipboard"
    Events[(Events["bell"] = 5)] = "bell"
    Events[(Events["desktopname"] = 6)] = "desktopname"
    Events[(Events["capabilities"] = 7)] = "capabilities"
  })(Events || (Events = {}))
  
  const Screen = (props, ref) => {
    const rfb = useRef(null)
    const connected = useRef(props.autoConnect ?? true)
    const timeouts = useRef([])
    const eventListeners = useRef({})
    const screen = useRef(null)
    const [loading, setLoading] = useState(true)
  
    const {
      url,
      style,
      className,
      viewOnly,
      rfbOptions,
      focusOnClick,
      clipViewport,
      dragViewport,
      scaleViewport,
      resizeSession,
      showDotCursor,
      background,
      qualityLevel,
      compressionLevel,
      autoConnect = true,
      retryDuration = 3000,
      debug = false,
      loadingUI,
      onConnect,
      onDisconnect,
      onCredentialsRequired,
      onSecurityFailure,
      onClipboard,
      onBell,
      onDesktopName,
      onCapabilities
    } = props
  
    const logger = {
      log: (...args) => {
        if (debug) console.log(...args)
      },
      info: (...args) => {
        if (debug) console.info(...args)
      },
      error: (...args) => {
        if (debug) console.error(...args)
      }
    }
  
    const getRfb = () => {
      return rfb.current
    }
  
    const setRfb = _rfb => {
      rfb.current = _rfb
    }
  
    const getConnected = () => {
      return connected.current
    }
  
    const setConnected = state => {
      connected.current = state
    }
  
    const _onConnect = () => {
      const rfb = getRfb()
      if (onConnect) {
        onConnect(rfb ?? undefined)
        setLoading(false)
        return
      }
  
      logger.info("Connected to remote VNC.")
      setLoading(false)
    }
  
    const _onDisconnect = () => {
      const rfb = getRfb()
      if (onDisconnect) {
        onDisconnect(rfb ?? undefined)
        setLoading(true)
        return
      }
  
      const connected = getConnected()
      if (connected) {
        logger.info(
          `Unexpectedly disconnected from remote VNC, retrying in ${retryDuration /
            1000} seconds.`
        )
  
        timeouts.current.push(setTimeout(connect, retryDuration))
      } else {
        logger.info(`Disconnected from remote VNC.`)
      }
      setLoading(true)
    }
  
    const _onCredentialsRequired = () => {
      const rfb = getRfb()
      if (onCredentialsRequired) {
        onCredentialsRequired(rfb ?? undefined)
        return
      }
  
      const password =
        rfbOptions?.credentials?.password ?? prompt("Password Required:")
      rfb?.sendCredentials({ password: password })
    }
  
    const _onDesktopName = e => {
      if (onDesktopName) {
        onDesktopName(e)
        return
      }
  
      logger.info(`Desktop name is ${e.detail.name}`)
    }
  
    const disconnect = () => {
      const rfb = getRfb()
      try {
        if (!rfb) {
          return
        }
  
        timeouts.current.forEach(clearTimeout)
        Object.keys(eventListeners.current).forEach(event => {
          if (eventListeners.current[event]) {
            rfb.removeEventListener(event, eventListeners.current[event])
            eventListeners.current[event] = undefined
          }
        })
        rfb.disconnect()
        setRfb(null)
        setConnected(false)
  
        // NOTE(roerohan): This needs to be called since the event listener is removed.
        // Even if the event listener is removed after rfb.disconnect(), the disconnect
        // event is not fired.
        _onDisconnect()
      } catch (err) {
        logger.error(err)
        setRfb(null)
        setConnected(false)
      }
    }
  
    const connect = () => {
      try {
        if (connected && !!rfb) {
          disconnect()
        }
  
        if (!screen.current) {
          return
        }
  
        screen.current.innerHTML = ""
  
        const _rfb = new RFB(screen.current, url, rfbOptions)
  
        _rfb.viewOnly = viewOnly ?? false
        _rfb.focusOnClick = focusOnClick ?? false
        _rfb.clipViewport = clipViewport ?? false
        _rfb.dragViewport = dragViewport ?? false
        _rfb.resizeSession = resizeSession ?? false
        _rfb.scaleViewport = scaleViewport ?? false
        _rfb.showDotCursor = showDotCursor ?? false
        _rfb.background = background ?? ""
        _rfb.qualityLevel = qualityLevel ?? 6
        _rfb.compressionLevel = compressionLevel ?? 2
        setRfb(_rfb)
  
        eventListeners.current.connect = _onConnect
        eventListeners.current.disconnect = _onDisconnect
        eventListeners.current.credentialsrequired = _onCredentialsRequired
        eventListeners.current.securityfailure = onSecurityFailure
        eventListeners.current.clipboard = onClipboard
        eventListeners.current.bell = onBell
        eventListeners.current.desktopname = _onDesktopName
        eventListeners.current.capabilities = onCapabilities
  
        Object.keys(eventListeners.current).forEach(event => {
          if (eventListeners.current[event]) {
            _rfb.addEventListener(event, eventListeners.current[event])
          }
        })
  
        setConnected(true)
      } catch (err) {
        logger.error(err)
      }
    }
  
    const sendCredentials = credentials => {
      const rfb = getRfb()
      rfb?.sendCredentials(credentials)
    }
  
    const sendKey = (keysym, code, down) => {
      const rfb = getRfb()
      rfb?.sendKey(keysym, code, down)
    }
  
    const sendCtrlAltDel = () => {
      const rfb = getRfb()
      rfb?.sendCtrlAltDel()
    }
  
    const focus = () => {
      const rfb = getRfb()
      rfb?.focus()
    }
  
    const blur = () => {
      const rfb = getRfb()
      rfb?.blur()
    }
  
    const machineShutdown = () => {
      const rfb = getRfb()
      rfb?.machineShutdown()
    }
  
    const machineReboot = () => {
      const rfb = getRfb()
      rfb?.machineReboot()
    }
  
    const machineReset = () => {
      const rfb = getRfb()
      rfb?.machineReset()
    }
  
    const clipboardPaste = text => {
      const rfb = getRfb()
      rfb?.clipboardPasteFrom(text)
    }
  
    useImperativeHandle(ref, () => ({
      connect,
      disconnect,
      connected: connected.current,
      sendCredentials,
      sendKey,
      sendCtrlAltDel,
      focus,
      blur,
      machineShutdown,
      machineReboot,
      machineReset,
      clipboardPaste,
      rfb: rfb.current,
      eventListeners: eventListeners.current
    }))
  
    useEffect(() => {
      if (autoConnect) {
        connect()
      }
  
      return disconnect
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    const handleClick = () => {
      const rfb = getRfb()
      if (!rfb) return
  
      rfb.focus()
    }
  
    const handleMouseEnter = () => {
      if (
        document.activeElement &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur()
      }
  
      handleClick()
    }
  
    const handleMouseLeave = () => {
      const rfb = getRfb()
      if (!rfb) {
        return
      }
  
      rfb.blur()
    }
  
    return (
      <>
        <div
          style={style}
          className={className}
          ref={screen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {loading &&
          (loadingUI ?? <div className="text-white loading">Loading...</div>)}
      </>
    )
  }
  
  export default forwardRef(Screen)
  