import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/Loadr";
import { LinkCard } from "../components/LinkCard";

export const DetailPage = () => {
    const { token } = useContext(AuthContext);
    const { request, loding } = useHttp();
    const [ link, setLink ] = useState(null);
    const linkId = useParams().id;

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${ linkId }`, 'GET', null, {
                Authorization: `Bearer ${ token }`
            })
            setLink(fetched);
        } catch (e) {

        }
    }, [ token, linkId, request ]);

    useEffect(() => {
        getLink();
    }, [ getLink ]);

    if (loding) {
        return <Loader />;
    }
    return (
        <>
            { !loding && link && <LinkCard link={ link } /> }
        </>
    );
}
