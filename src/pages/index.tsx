import { FormEvent, useState } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { CopySimple, Check } from 'phosphor-react';

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheck from '../assets/icon-check.svg';
import { api } from '../lib/axios';

type Data = {
  poolCount: number;
  guessCount: number;
  userCount: number;
};

export const getStaticProps: GetStaticProps<Data> = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 24 * 60 * 60, // 1d,
  };
};

export default function Home({
  poolCount,
  guessCount,
  userCount,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [poolTitle, setPoolTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [poolCode, setPoolCode] = useState('');

  async function createPool(e: FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post('/pools', { title: poolTitle });
      const { code } = response.data;
      setPoolCode(code);
      setIsSubmitting(false);
      setPoolTitle('');
      setModalOpen(true);
    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente!');
    }
  }

  function handleCopy() {
    setCopying(true);
    navigator.clipboard.writeText(poolCode);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
  }

  return (
    <div className='max-w-[1124px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-28 p-8 h-screen items-center justify-items-center'>
      <main>
        <Image src={logoImg} alt='' />
        <h1 className='mt-14 text-white font-bold text-3xl sm:text-5xl leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt='' />
          <strong className='text-gray-100 text-xl'>
            <span className='text-green-500'>+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>
        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <form className='mt-10 flex gap-2' onSubmit={createPool}>
            <input
              className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
              type='text'
              required
              placeholder='Qual nome do seu bolão?'
              value={poolTitle}
              onChange={(e) => setPoolTitle(e.target.value)}
            />
            <button
              disabled={isSubmitting}
              type='submit'
              className='bg-yellow-500 px-3 py-2 rounded font-bold uppercase text-gray-900 hover:bg-yellow-600 text-sm md:text-base md:px-6 md:py-4 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600'
            >
              {isSubmitting ? 'Criando...' : 'Criar meu bolão'}
            </button>
          </form>

          <Dialog.Overlay className='bg-gray-900/50 fixed inset-0' />
          <Dialog.Portal>
            <Dialog.Content className='bg-black rounded-lg flex flex-col items-center justify-center w-full xs:w-80 xs:h-80 5 p-6 gap-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <Dialog.Title className='text-gray-100 font-bold text-2xl text-center'>
                Bolão criado com{' '}
                <span className='text-green-500'>sucesso!</span>
              </Dialog.Title>
              <div className='text-gray-100 text-xl text-center'>
                O código do bolão é:
                <div className='flex items-center gap-4 mt-2'>
                  <span className='block  text-yellow-500 font-bold text-3xl '>
                    {poolCode}
                  </span>
                  <div
                    className='cursor-pointer relative w-6 h-6'
                    onClick={handleCopy}
                  >
                    {copying ? (
                      <div
                        className='flex
                     items-center gap-2 absolute top-0'
                      >
                        <Check size={24} />
                        <span className='text-xs'>Copied!</span>
                      </div>
                    ) : (
                      <CopySimple size={24} />
                    )}
                  </div>
                </div>
              </div>
              <Dialog.Close />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <p className='text-sm text-gray-300 mt-4 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className='mt-10 pt-10 border-t border-gray-600 xs:divide-x divide-gray-600 grid xs:grid-cols-2 text-gray-100 gap-8 xs:gap-0'>
          <div className='flex gap-6 items-center xs:justify-center lg:justify-start'>
            <Image src={iconCheck} alt='' />
            <div className='flex flex-col '>
              <span className='font-bold text-2xl'>+{poolCount}</span>
              <span>bolões criados</span>
            </div>
          </div>
          <div className='flex gap-6 items-center   justify-end xs:justify-center lg:justify-end'>
            <Image src={iconCheck} alt='' />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt='Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa'
        quality={100}
      />
    </div>
  );
}
