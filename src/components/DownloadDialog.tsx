import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export type DownloadDialogKind = 'qr' | 'ios' | 'apk-demo' | null

type DownloadDialogProps = {
  kind: DownloadDialogKind
  onClose: () => void
}

function getPageUrl() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}${window.location.search}`
}

export default function DownloadDialog({ kind, onClose }: DownloadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (kind && !dialog.open) dialog.showModal()
    if (!kind && dialog.open) dialog.close()
  }, [kind])

  const closeIfBackdrop = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="download-dialog"
      aria-labelledby="download-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={closeIfBackdrop}
    >
      <div className="download-dialog-panel">
        <button className="download-dialog-close" type="button" aria-label="Fechar janela" onClick={onClose}>×</button>
        {kind === 'qr' && (
          <div className="download-dialog-content">
            <span className="download-dialog-kicker">NUTRIA NO SEU CELULAR</span>
            <h2 id="download-dialog-title">Leve o Nutria com você.</h2>
            <p>Escaneie este QR code com a câmera do celular para abrir esta mesma página no seu aparelho.</p>
            <div className="download-qr-frame">
              <QRCodeSVG value={getPageUrl()} size={216} level="M" marginSize={2} title="QR code para abrir a página do Nutria no celular" />
            </div>
            <span className="download-dialog-footnote">Abra a câmera e aponte para o código.</span>
          </div>
        )}
        {kind === 'ios' && (
          <div className="download-dialog-content download-dialog-message">
            <span className="download-dialog-symbol" aria-hidden="true">⌁</span>
            <span className="download-dialog-kicker">DISPONIBILIDADE</span>
            <h2 id="download-dialog-title">Ainda não chegamos ao iOS.</h2>
            <p>Desculpe! O aplicativo Nutria ainda não está disponível para iPhone ou iPad. Estamos trabalhando para chegar ao iOS.</p>
            <button className="button button-primary download-dialog-action" type="button" onClick={onClose}>Entendi</button>
          </div>
        )}
        {kind === 'apk-demo' && (
          <div className="download-dialog-content download-dialog-message">
            <span className="download-dialog-symbol" aria-hidden="true">↓</span>
            <span className="download-dialog-kicker">ARQUIVO DE DEMONSTRAÇÃO</span>
            <h2 id="download-dialog-title">Download iniciado.</h2>
            <p>O arquivo baixado é um TXT de demonstração, conforme solicitado. Ele não é um APK instalável; substitua-o pelo pacote Android assinado antes do lançamento.</p>
            <button className="button button-primary download-dialog-action" type="button" onClick={onClose}>Entendi</button>
          </div>
        )}
      </div>
    </dialog>
  )
}
