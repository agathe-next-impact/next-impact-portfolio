// API publique des fichiers rapatriés. Un seul point d'entrée, comme partout
// dans `src/cto/` : on importe d'ici, jamais de `./store` directement.

export {
  fileBelongsTo,
  fileDigest,
  FileTooLargeError,
  importFile,
  MAX_FILE_BYTES,
  mimeFromName,
  readFile,
  type FileRef,
} from "./store";
