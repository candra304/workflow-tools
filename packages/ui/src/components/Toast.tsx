import type { CSSProperties } from "react";

/** Toast bawah-tengah — tampil bila `message` tidak kosong. */
export function Toast({ message }: { message: string }) {
  return (
    <div className={`toast${message ? " show" : ""}`} role="status">
      {message}
    </div>
  );
}

export type { CSSProperties };
